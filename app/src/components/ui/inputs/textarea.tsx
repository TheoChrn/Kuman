import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import { ErrorMessage } from "~/components/ui/inputs/error-message/error-message";
import { useFieldContext } from "~/hooks/form-composition";

export interface TextareaProps extends TextareaAutosizeProps {
  label?: string;
}

export function TextareaInput({ label, maxRows = 1, ...props }: TextareaProps) {
  const field = useFieldContext<string>();

  return (
    <label className="textarea">
      {label}
      <TextareaAutosize
        maxRows={maxRows}
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      {field.state.meta.errors[0]?.message && (
        <ErrorMessage>{field.state.meta.errors[0].message}</ErrorMessage>
      )}
    </label>
  );
}
