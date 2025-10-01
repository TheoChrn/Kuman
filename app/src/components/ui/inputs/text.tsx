import { ComponentPropsWithRef } from "react";
import { ErrorMessage } from "~/components/ui/inputs/error-message/error-message";
import { useFieldContext } from "~/hooks/form-composition";

export interface InputProps extends ComponentPropsWithRef<"input"> {
  label?: React.ReactNode;
}

export function TextInput({ label, ...props }: InputProps) {
  const field = useFieldContext<string>();

  return (
    <div className="input">
      <label>
        {label}
        <input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className="text-input"
          {...props}
        />
      </label>
      {field.state.meta.errors[0]?.message && (
        <ErrorMessage>{field.state.meta.errors[0].message}</ErrorMessage>
      )}
    </div>
  );
}
