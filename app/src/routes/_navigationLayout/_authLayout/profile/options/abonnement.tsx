import * as Ariakit from "@ariakit/react";
import { Role } from "@kuman/db/enums";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { PiCheckBold } from "react-icons/pi";
import { TabPanel } from "~/components/tab-panel";
import { Button } from "~/components/ui/buttons/button";
import { useTRPC } from "~/trpc/react";

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

      <div className="tabs">
        <Ariakit.TabProvider defaultSelectedId="month">
          <Ariakit.TabList className="tab-list">
            <Ariakit.Tab id="month" className="tab">
              Mensuel
            </Ariakit.Tab>
            <Ariakit.Tab id="year" className="tab">
              Annuel
            </Ariakit.Tab>
          </Ariakit.TabList>
          <div className="panels">
            <TabPanel id="month" tabId="month" className="tab-panel">
              <Ariakit.HeadingLevel>
                <div>
                  <Ariakit.Heading className="heading">
                    8,99€ <span>/ mois</span>
                  </Ariakit.Heading>
                  <p>Testez gratuitement pendant 14 jours</p>
                </div>
                <Button
                  onClick={async () => {
                    const res = await caller.stripe.createStripeSession.mutate({
                      interval: "month",
                    });
                    if (res) {
                      navigate({ href: res });
                    }
                  }}
                  className="button button-primary"
                >
                  Je m'abonne
                </Button>
                <div className="separator">
                  <span>Inclus</span>
                  <div />
                </div>
                <ul>
                  <li>
                    <PiCheckBold /> Lecture illimitée
                  </li>
                  <li>
                    <PiCheckBold /> Favoris et suivi de lecture
                  </li>
                  <li>
                    <PiCheckBold /> Sans engagement
                  </li>
                </ul>
              </Ariakit.HeadingLevel>
            </TabPanel>
            <TabPanel id="year" tabId="year" className="tab-panel">
              <Ariakit.HeadingLevel>
                <div>
                  <Ariakit.Heading className="heading">
                    7,17€ <span>/ mois</span> <span className="tag">-20%</span>
                  </Ariakit.Heading>
                  <small>Soit 85.99€ facturé annuellement</small>
                  <p className="free-trial">
                    Testez gratuitement pendant 14 jours
                  </p>
                </div>
                <Button
                  onClick={async () => {
                    console.log("click");
                    const res = await caller.stripe.createStripeSession.mutate({
                      interval: "year",
                    });
                    if (res) {
                      navigate({ href: res });
                    }
                  }}
                  className="button button-primary"
                >
                  Je m'abonne
                </Button>
                <div className="separator">
                  <span>Inclus</span>
                  <div />
                </div>
                <ul>
                  <li>
                    <PiCheckBold /> Lecture illimitée
                  </li>
                  <li>
                    <PiCheckBold /> Favoris et suivi de lecture
                  </li>
                  <li>
                    <PiCheckBold /> Sans engagement
                  </li>
                </ul>
              </Ariakit.HeadingLevel>
            </TabPanel>
          </div>
        </Ariakit.TabProvider>
      </div>

      <Outlet />
    </div>
  );
}
