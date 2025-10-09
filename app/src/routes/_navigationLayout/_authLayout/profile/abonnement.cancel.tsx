import * as Ariakit from "@ariakit/react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

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
    <Ariakit.DialogProvider>
      <Ariakit.Dialog>
        <Ariakit.DialogHeading>Paiment annulé</Ariakit.DialogHeading>
      </Ariakit.Dialog>
    </Ariakit.DialogProvider>
  );
}
