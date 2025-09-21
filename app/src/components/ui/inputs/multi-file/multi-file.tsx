import * as Ariakit from "@ariakit/react";
import { InputHTMLAttributes, useEffect, useRef } from "react";
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
  const field = useFieldContext<File[]>();
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

              field.handleChange(validFiles);
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
              currentUrlRef.current = validFiles.map((file) =>
                URL.createObjectURL(file)
              );

              field.handleChange(validFiles);
            }}
          >
            {label}
          </div>
        </div>
      </label>

      {!!field.state.value.length && (
        <div className="files-container">
          {field.state.value.map((_, index) => (
            <img
              key={index}
              src={currentUrlRef.current?.[index] || undefined}
              alt="Preview"
            />
          ))}
        </div>
      )}

      {field.state.meta.errors[0]?.message && (
        <ErrorMessage>{field.state.meta.errors[0].message}</ErrorMessage>
      )}
    </div>
  );
}
