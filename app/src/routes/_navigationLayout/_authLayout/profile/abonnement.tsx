import * as Ariakit from "@ariakit/react";
import { role, Role } from "@kuman/db/enums";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Tabs } from "~/components/tabs";
import { Button } from "~/components/ui/buttons/button";
import { seo } from "~/utils/seo";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/profile/abonnement"
)({
  head: () => ({
    meta: [
      ...seo({
        title: "Kuman | Abonnement",
      }),
    ],
  }),
  component: RouteComponent,
  loader: async ({ context: { user, trpc, queryClient, trpcClient } }) => {
    if (user?.stripeCustomerId) {
      const status = await queryClient.ensureQueryData(
        trpc.stripe.getStripeCustomer.queryOptions()
      );
      const isSubscribed = status === "active" || status === "trialing";

      if (!isSubscribed && user!.role === "subscriber") {
        trpcClient.user.updateRole.mutate({ role: "user" });
        queryClient.setQueryData(
          trpc.user.getCurrentUser.queryKey(),
          (prev) => {
            const prevData = prev!;
            return { ...prevData, role: "user" as Role };
          }
        );
        queryClient.invalidateQueries(trpc.user.getCurrentUser.pathFilter());
      }
    }
  },
});

function RouteComponent() {
  const { trpcClient } = Route.useRouteContext();
  const { user } = Route.useRouteContext();

  if (user!.role === role.ADMINISTRATOR) {
    return (
      <section id="abonnement">
        <Ariakit.HeadingLevel>
          <Ariakit.Heading className="heading">
            La modération n'a pas besoin d'abonnement
          </Ariakit.Heading>
        </Ariakit.HeadingLevel>
      </section>
    );
  }

  if (user!.role === role.SUBSCRIBER) {
    return (
      <section id="abonnement">
        <Ariakit.HeadingLevel>
          <Ariakit.Heading className="heading">
            Détails de votre abonnement
          </Ariakit.Heading>
          <div>
            <Button className="button button-primary">
              Gérer votre abonnement
            </Button>
          </div>
        </Ariakit.HeadingLevel>
      </section>
    );
  }

  return (
    <section id="abonnement">
      <Ariakit.HeadingLevel>
        <Ariakit.Heading className="heading">
          Votre abonnement est inactif
        </Ariakit.Heading>
        <div>
          <Tabs caller={trpcClient} />
          <Outlet />
        </div>
      </Ariakit.HeadingLevel>
    </section>
  );
}
