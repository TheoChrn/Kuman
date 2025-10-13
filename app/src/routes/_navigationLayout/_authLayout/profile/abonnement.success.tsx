import * as Ariakit from "@ariakit/react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { PiXBold } from "react-icons/pi";
import { Dialog, DialogHeading } from "~/components/ui/dialog";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/profile/abonnement/success"
)({
  component: RouteComponent,
  validateSearch: ({ session_id }: { session_id: string }) => {
    return {
      sessionId: session_id,
    };
  },
  beforeLoad: async ({ context: { trpcClient, user, queryClient, trpc } }) => {
    if (user?.role === "subscriber" || !user?.stripeCustomerId)
      redirect({ to: "/profile/abonnement" });

    await queryClient.invalidateQueries(trpc.user.getCurrentUser.pathFilter());

    trpcClient.user.updateRole.mutate({ role: "subscriber" });
  },
});

function RouteComponent() {
  return (
    <Dialog backUrl="..">
      <DialogHeading>
        <Ariakit.DialogHeading className="dialog-heading">
          Paiment Réussi
        </Ariakit.DialogHeading>
      </DialogHeading>
    </Dialog>
  );
}
