import * as Ariakit from "@ariakit/react";
import { InputHTMLAttributes, useEffect, useRef } from "react";
import { ErrorMessage } from "~/components/ui/inputs/error-message/error-message";
import { InputProps } from "~/components/ui/inputs/text";
import { useFieldContext } from "~/hooks/form-composition";
import styles from "./styles.module.scss";

interface FileInputProps
  extends InputProps,
    InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: boolean;
}

const allowedExtensions = ["jpg", "jpeg", "webp"];

function isExtensionValid(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

export function FileInput({ label, className, ...props }: FileInputProps) {
  const field = useFieldContext<File | {}>();
  const currentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
    };
  }, []);

  return (
    <label className={`${styles["file-input"]} ${className}`}>
      <Ariakit.VisuallyHidden>
        <input
          id={field.name}
          name={field.name}
          type="file"
          onBlur={field.handleBlur}
          accept="image/jpeg, image/jpg, image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file || !isExtensionValid(file.name)) return;

            if (currentUrlRef.current)
              URL.revokeObjectURL(currentUrlRef.current);
            currentUrlRef.current = URL.createObjectURL(file);
            field.handleChange(file);
          }}
          {...props}
        />
      </Ariakit.VisuallyHidden>
      <div className={styles["drop-zone-container"]}>
        <div
          className={styles["drop-zone"]}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (!file || !isExtensionValid(file.name)) return;

            if (currentUrlRef.current)
              URL.revokeObjectURL(currentUrlRef.current);
            currentUrlRef.current = URL.createObjectURL(file);
            field.handleChange(file);
          }}
        >
          {label}
        </div>

        {field.state.value instanceof File && (
          <img src={currentUrlRef.current || undefined} alt="Preview" />
        )}
      </div>

      {field.state.meta.errors[0]?.message && (
        <ErrorMessage>{field.state.meta.errors[0].message}</ErrorMessage>
      )}
    </label>
  );
}
