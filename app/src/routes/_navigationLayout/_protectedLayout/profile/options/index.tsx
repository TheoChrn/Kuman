import { Link, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import {
  PiArrowLeftBold,
  PiCrownCrossDuotone,
  PiCrownDuotone,
  PiSignOutBold,
} from "react-icons/pi";
import * as Ariakit from "@ariakit/react";
import { Button } from "~/components/ui/buttons/button";
import { useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_navigationLayout/_protectedLayout/profile/options/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const router = useRouter();
  const logoutMutation = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: async () => {
        queryClient.clear();
        router.invalidate();
        navigate({ to: "/auth/login" });
      },
    })
  );
  return (
    <div id="settings">
      <main>
        <Link
          to="/profile/options/abonnement"
          className="button button-neutral"
        >
          <PiCrownDuotone size={24} />
          Abonnement
        </Link>
        <Button
          className="button button-neutral"
          onClick={() => logoutMutation.mutate()}
        >
          <PiSignOutBold size={24} />
          Se déconnecter
        </Button>
      </main>
    </div>
  );
}
