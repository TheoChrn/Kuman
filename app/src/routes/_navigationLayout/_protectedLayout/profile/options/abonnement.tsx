import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_navigationLayout/_protectedLayout/profile/options/abonnement"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <p>Votre abonnement est inactif</p>
    </div>
  );
}
