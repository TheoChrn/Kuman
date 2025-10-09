import * as Ariakit from "@ariakit/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PiBook, PiChat, PiMagnifyingGlass, PiSparkle } from "react-icons/pi";
import { Footer } from "~/components/footer";
import { Tabs } from "~/components/tabs";
export const Route = createFileRoute("/_navigationLayout/")({
  component: Home,
});

function Home() {
  const { trpcClient } = Route.useRouteContext();

  return (
    <Ariakit.HeadingLevel>
      <Ariakit.Heading>
        <Ariakit.VisuallyHidden>Page d'accueil</Ariakit.VisuallyHidden>
      </Ariakit.Heading>

      <div id="home">
        <Ariakit.HeadingLevel>
          <header>
            <div>
              <div className="hero-details">
                <Ariakit.Heading>+300 titre</Ariakit.Heading>
                <p>Une seule plateforme</p>
                <p>Tous vos mangas à portée de clique</p>
              </div>
              <div className="button-container">
                <Link to="/catalogue" className="button button-outline">
                  Voir le catalogue
                </Link>
                <Link
                  to="/"
                  hash="plans"
                  hashScrollIntoView
                  className="button button-primary"
                >
                  S'abonner
                </Link>
              </div>
            </div>
          </header>
        </Ariakit.HeadingLevel>
        <main>
          <section className="features">
            <Ariakit.HeadingLevel>
              <Ariakit.VisuallyHidden>
                <Ariakit.Heading>Fonctionnalitées</Ariakit.Heading>
              </Ariakit.VisuallyHidden>
              <ul>
                {[
                  [<PiBook size={75} />, "Gère ta collection"],
                  [
                    <PiMagnifyingGlass size={75} />,
                    "Explore des centaines de séries",
                  ],

                  [<PiSparkle size={75} />, "Recommandations selon tes goûts"],
                  [<PiChat size={75} />, "Lis et partage des avis"],
                ].map(([icon, value], index) => (
                  <li key={index}>
                    {icon}
                    <p>{value}</p>
                  </li>
                ))}
              </ul>
            </Ariakit.HeadingLevel>
          </section>
          <section id="plans" className="plans">
            <Ariakit.HeadingLevel>
              <Ariakit.Heading>Découvrez notre abonnement</Ariakit.Heading>
              <Tabs caller={trpcClient} />
            </Ariakit.HeadingLevel>
          </section>
        </main>
        <Footer />
      </div>
    </Ariakit.HeadingLevel>
  );
}
