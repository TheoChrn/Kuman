import { ComponentPropsWithRef } from "react";
import { ErrorMessage } from "~/components/ui/inputs/error-message/error-message";
import { useFieldContext } from "~/hooks/form-composition";

export interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  label?: string;
}

export function TextareaInput({ label, ...props }: TextareaProps) {
  const field = useFieldContext<string>();

  return (
    <label>
      {label}
      <textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <ErrorMessage>{field.state.meta.errors[0]?.message}</ErrorMessage>
      ) : null}
    </label>
  );
}
