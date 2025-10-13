import * as Ariakit from "@ariakit/react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { PiXBold } from "react-icons/pi";
import { Dialog, DialogHeading } from "~/components/ui/dialog";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/profile/abonnement/cancel"
)({
  component: RouteComponent,
  beforeLoad: ({ context: { user } }) => {
    if (user?.stripeCustomerId) redirect({ to: "/profile/abonnement" });
  },
});

function RouteComponent() {
  return (
    <Dialog backUrl="..">
      <DialogHeading>
        <Ariakit.DialogHeading className="dialog-heading">
          Paiement annulé
        </Ariakit.DialogHeading>
      </DialogHeading>
    </Dialog>
  );
}
