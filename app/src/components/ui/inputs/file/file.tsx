import * as Ariakit from "@ariakit/react";
import { useStore } from "@tanstack/react-store";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { ErrorMessage } from "~/components/ui/inputs/error-message/error-message";
import { InputProps } from "~/components/ui/inputs/text";
import { useFieldContext } from "~/hooks/form-composition";

interface FileInputProps
  extends InputProps,
    InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: boolean;
  imagePreview: string | null;
}

const allowedExtensions = ["jpg", "jpeg", "webp"];

function isExtensionValid(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

export function FileInput({
  label,
  className,
  imagePreview,
  ...props
}: FileInputProps) {
  const field = useFieldContext<File | null>();

  useEffect(() => {
    if (imagePreview) {
      return () => URL.revokeObjectURL(imagePreview);
    }
  }, []);

  return (
    <label className={`file-input ${className}`}>
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

            if (imagePreview) {
              URL.revokeObjectURL(imagePreview);
            }

            field.handleChange(file);
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
            const file = e.dataTransfer.files[0];
            if (!file || !isExtensionValid(file.name)) return;

            if (imagePreview) {
              URL.revokeObjectURL(imagePreview);
            }
          }}
        >
          {label}
        </div>

        {imagePreview && <img src={imagePreview || undefined} alt="Preview" />}
      </div>

      {field.state.meta.errors[0]?.message && (
        <ErrorMessage>{field.state.meta.errors[0].message}</ErrorMessage>
      )}
    </label>
  );
}
