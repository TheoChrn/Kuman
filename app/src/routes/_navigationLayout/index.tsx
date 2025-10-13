import * as Ariakit from "@ariakit/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PiBook, PiChat, PiMagnifyingGlass, PiSparkle } from "react-icons/pi";
import { Footer } from "~/components/footer";
import { Tabs } from "~/components/tabs";
export const Route = createFileRoute("/_navigationLayout/")({
  component: Home,
});

function Home() {
  return (
    <Ariakit.HeadingLevel>
      <Ariakit.VisuallyHidden render={<Ariakit.Heading />}>
        Page d'accueil
      </Ariakit.VisuallyHidden>

      <div id="home">
        <Ariakit.HeadingLevel>
          <header>
            <div>
              <div className="hero-details">
                <Ariakit.Heading>Une seule plateforme</Ariakit.Heading>
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
              <Ariakit.VisuallyHidden render={<Ariakit.Heading />}>
                Fonctionnalitées
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
              <Tabs />
            </Ariakit.HeadingLevel>
          </section>
        </main>
        <Footer />
      </div>
    </Ariakit.HeadingLevel>
  );
}
