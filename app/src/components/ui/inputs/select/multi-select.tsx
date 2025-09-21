import { ErrorMessage } from "~/components/ui/inputs/error-message/error-message";
import { Select, SelectProps } from "~/components/ui/inputs/select/select";
import { useFieldContext } from "~/hooks/form-composition";

export interface MultiSelectInputProps extends SelectProps {
  label?: string;
}

export function MultiSelectInput({ label, ...props }: MultiSelectInputProps) {
  const field = useFieldContext<string[]>();

  return (
    <label>
      {label}
      <Select
        selectProviderProps={{
          value: field.state.value,
          setValue: (value: string[]) => {
            field.handleChange(value);
          },
        }}
        {...props}
      />
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <ErrorMessage>{field.state.meta.errors[0]?.message}</ErrorMessage>
      ) : null}
    </label>
  );
}
