import { ComponentPropsWithRef, useState } from "react";
import { Button } from "~/components/ui/buttons/button";
import { ErrorMessage } from "~/components/ui/inputs/error-message/error-message";
import { useFieldContext } from "~/hooks/form-composition";
import * as Ariakit from "@ariakit/react";
import { PiEye, PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
export interface InputProps extends ComponentPropsWithRef<"input"> {
  label?: React.ReactNode;
}

export function PasswordInput({ label, ...props }: InputProps) {
  const field = useFieldContext<string>();
  const [showPassword, toggleShowPassword] = useState(false);

  return (
    <div className="input">
      <label className="password-input">
        {label}
        <div>
          <input
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            type={showPassword ? "text" : "password"}
            {...props}
          />
          <Button onClick={() => toggleShowPassword(!showPassword)}>
            <Ariakit.VisuallyHidden>
              {showPassword ? "Cacher" : "Monter"} le mot de passe
            </Ariakit.VisuallyHidden>
            {showPassword ? <PiEyeBold /> : <PiEyeClosedBold />}
          </Button>
        </div>
      </label>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <ErrorMessage>{field.state.meta.errors[0]?.message}</ErrorMessage>
      ) : null}
    </div>
  );
}
