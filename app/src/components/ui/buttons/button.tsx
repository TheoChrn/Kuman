import * as Ariakit from "@ariakit/react";

export function Button(props: Ariakit.ButtonProps) {
  return <Ariakit.Button {...props} accessibleWhenDisabled />;
}
