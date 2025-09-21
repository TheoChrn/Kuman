import * as Ariakit from "@ariakit/react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { PiXBold } from "react-icons/pi";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/profile/abonnement/success"
)({
  component: RouteComponent,
  validateSearch: ({ session_id }: { session_id: string }) => {
    return {
      sessionId: session_id,
    };
  },
  beforeLoad: async ({ context: { caller, user, queryClient, trpc } }) => {
    if (user?.role === "subscriber")
      redirect({ to: "/profile/options/abonnement" });

    await queryClient.invalidateQueries(trpc.user.getCurrentUser.pathFilter());

    caller.user.updateRole.mutate({ role: "subscriber" });
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <Ariakit.DialogProvider>
      <Ariakit.Dialog
        onClose={() => navigate({ to: "/profile/options/abonnement" })}
        open={true}
        className="dialog"
        backdrop={<div className="backdrop"></div>}
      >
        <div>
          <Ariakit.DialogHeading className="dialog-heading">
            Paiment Réussi
          </Ariakit.DialogHeading>
          <Ariakit.DialogDismiss className="dialog-dismiss">
            <PiXBold />
          </Ariakit.DialogDismiss>
        </div>
        <Ariakit.DialogDescription></Ariakit.DialogDescription>
      </Ariakit.Dialog>
    </Ariakit.DialogProvider>
  );
}
