import * as Ariakit from "@ariakit/react";
import { NavigateOptions, useNavigate } from "@tanstack/react-router";
import { PiXBold } from "react-icons/pi";

export function Dialog(props: {
  backUrl: NavigateOptions["to"];
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <Ariakit.DialogProvider>
      <Ariakit.Dialog
        onClose={() => navigate({ to: props.backUrl, resetScroll: false })}
        open={true}
        modal
        className="dialog"
        backdrop={<div className="backdrop"></div>}
      >
        {props.children}
      </Ariakit.Dialog>
    </Ariakit.DialogProvider>
  );
}

export function DialogHeading(props: { children: React.ReactNode }) {
  return (
    <div className="dialog-heading">
      <Ariakit.DialogHeading className="heading-5">
        {props.children}
      </Ariakit.DialogHeading>
      <Ariakit.DialogDismiss className="dialog-dismiss">
        <PiXBold size={24} />
      </Ariakit.DialogDismiss>
    </div>
  );
}
