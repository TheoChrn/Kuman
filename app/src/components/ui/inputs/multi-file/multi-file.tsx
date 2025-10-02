import * as Ariakit from "@ariakit/react";
import { ImageSchema } from "@kuman/shared/validators";
import { InputHTMLAttributes, useEffect, useRef } from "react";
import { PiPlus } from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";
import { ErrorMessage } from "~/components/ui/inputs/error-message/error-message";
import { InputProps } from "~/components/ui/inputs/text";
import { useFieldContext } from "~/hooks/form-composition";

interface MultiFileInputProps
  extends InputProps,
    InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: boolean;
}

const allowedExtensions = ["jpg", "jpeg", "webp"];

function isExtensionValid(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

export function MultiFileInput({
  label,
  className,
  ...props
}: MultiFileInputProps) {
  const field = useFieldContext<ImageSchema[]>();
  const currentUrlRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      if (currentUrlRef.current) {
        currentUrlRef.current.forEach((url) => {
          if (url) URL.revokeObjectURL(url);
        });
      }
    };
  }, []);

  return (
    <div className={`multi-file-input ${className}`}>
      <label>
        <Ariakit.VisuallyHidden>
          <input
            id={field.name}
            name={field.name}
            multiple
            type="file"
            onBlur={field.handleBlur}
            accept="image/jpeg, image/jpg, image/webp"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              const validFiles = files.filter(
                (file) => file && isExtensionValid(file.name)
              );

              if (currentUrlRef.current)
                currentUrlRef.current.forEach((url) => {
                  if (url) URL.revokeObjectURL(url);
                });

              field.handleChange([
                ...field.state.value,
                ...validFiles.map((file) => ({
                  file,
                  status: "new",
                  url: URL.createObjectURL(file),
                })),
              ]);
            }}
            {...props}
          />
        </Ariakit.VisuallyHidden>
        <div className="drop-zone-container">
          <div
            className="drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();

              const files = Array.from(e.dataTransfer.files || []);
              const validFiles = files.filter(
                (file) => file && isExtensionValid(file.name)
              );

              if (currentUrlRef.current)
                currentUrlRef.current.forEach((url) => {
                  if (url) URL.revokeObjectURL(url);
                });

              field.handleChange([
                ...field.state.value,
                ...validFiles.map((file) => ({
                  file,
                  status: "new",
                  url: URL.createObjectURL(file),
                })),
              ]);
            }}
          >
            {label}
          </div>
        </div>
      </label>

      {!!field.state.value.length && (
        <div className="files-container">
          {field.state.value.map((image, index) =>
            image.status === "deleted" ? null : (
              <div key={image.path ?? index}>
                <img src={image.url || undefined} alt="Preview" />
                <Button
                  onClick={() =>
                    field.handleChange(
                      field.state.value.map((val, idx) =>
                        idx === index ? { ...val, status: "deleted" } : val
                      )
                    )
                  }
                  className="button"
                >
                  <PiPlus />
                </Button>
              </div>
            )
          )}
        </div>
      )}

      {field.state.meta.errors[0]?.message && (
        <ErrorMessage>{field.state.meta.errors[0].message}</ErrorMessage>
      )}
    </div>
  );
}
