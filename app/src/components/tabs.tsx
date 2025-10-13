import * as Ariakit from "@ariakit/react";
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { PiCheckBold } from "react-icons/pi";
import { TabPanel } from "~/components/tab-panel";
import { Button } from "~/components/ui/buttons/button";

export function Tabs() {
  const { trpcClient, user } = useRouteContext({ from: "__root__" });
  const navigate = useNavigate();

  return (
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
          <TabPanel tabId="month" className="tab-panel">
            <Ariakit.HeadingLevel>
              <div>
                <Ariakit.Heading className="heading">
                  8,99€ <span>/ mois</span>
                </Ariakit.Heading>
                <p>Testez gratuitement pendant 14 jours</p>
              </div>
              {!user ? (
                <Link to="/auth/login" className="button button-primary">
                  Je m'abonne
                </Link>
              ) : (
                <Button
                  onClick={async () => {
                    const res =
                      await trpcClient.stripe.createStripeSession.mutate({
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
              )}

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
          <TabPanel tabId="year" className="tab-panel">
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
              {!user ? (
                <Link to="/auth/login" className="button button-primary">
                  Je m'abonne
                </Link>
              ) : (
                <Button
                  onClick={async () => {
                    const res =
                      await trpcClient.stripe.createStripeSession.mutate({
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
              )}
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
  );
}
