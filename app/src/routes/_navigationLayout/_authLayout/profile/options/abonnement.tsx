import { Role } from "@kuman/db/enums";
import {
  createFileRoute,
  Outlet,
  useNavigate
} from "@tanstack/react-router";
import { Tabs } from "~/components/tabs";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/profile/options/abonnement"
)({
  component: RouteComponent,
  loader: async ({ context: { user, trpc, queryClient, caller } }) => {
    const status = await queryClient.ensureQueryData(
      trpc.stripe.getStripeCustomer.queryOptions()
    );

    const isSubscribed = status === "active" || status === "trialing";

    if (!isSubscribed && user!.role === "subscriber") {
      caller.user.updateRole.mutate({ role: "user" });
      queryClient.setQueryData(trpc.user.getCurrentUser.queryKey(), (prev) => {
        const prevData = prev!;
        return { ...prevData, role: "user" as Role };
      });
      queryClient.invalidateQueries(trpc.user.getCurrentUser.pathFilter());
    }
    return { role: user!.role };
  },
});

function RouteComponent() {
  const { caller } = Route.useRouteContext();
  const { role } = Route.useLoaderData();

  const navigate = useNavigate();

  // if (role === "subscriber") {
  //   return (
  //     <Ariakit.HeadingLevel>
  //       <Ariakit.Heading>Détails de votre abonnement</Ariakit.Heading>
  //       <div>
  //         <Button className="button button-primary">
  //           Gérer votre abonnement
  //         </Button>
  //       </div>
  //     </Ariakit.HeadingLevel>
  //   );
  // }

  return (
    <div>
      <p>Votre abonnement est inactif</p>

      <Tabs caller={caller} />

      <Outlet />
    </div>
  );
}
