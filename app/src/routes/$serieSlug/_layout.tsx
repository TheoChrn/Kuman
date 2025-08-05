import * as Ariakit from "@ariakit/react";
import { statusLabelFrench } from "@kuman/db/enums";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import {
  PiInstagramLogo,
  PiInstagramLogoBold,
  PiTiktokLogo,
  PiTiktokLogoBold,
  PiX,
  PiXLogo,
  PiXLogoBold,
} from "react-icons/pi";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/$serieSlug/_layout")({
  loader: async ({ context: { trpc, queryClient }, params: { serieSlug } }) => {
    const [serie] = await Promise.all([
      queryClient.ensureQueryData(
        trpc.mangas.get.queryOptions({ slug: serieSlug })
      ),
      queryClient.ensureQueryData(
        trpc.chapters.getAll.queryOptions({ serie: serieSlug })
      ),
    ]);

    if (!serie) throw new Error("Cette série n'existe pas");
  },
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const { serieSlug } = Route.useParams();
  const { data: manga } = useSuspenseQuery(
    trpc.mangas.get.queryOptions({ slug: serieSlug })
  );

  return (
    <Ariakit.HeadingLevel>
      <div>
        <header>
          <div>
            <img
              height={180}
              width={120}
              src={manga?.coverUrl ?? ""}
              alt={`Illustration ${manga.title}`}
            />
            <ul>
              <li>
                <Ariakit.Heading>{manga.title}</Ariakit.Heading>
              </li>
              <li className="status">{statusLabelFrench[manga.status]}</li>
              <li>De {manga.author}</li>
              <Link
                to="/$serieSlug/$chapterNumber/$page"
                params={{
                  chapterNumber: "1",
                  page: "1",
                  serieSlug: manga.slug,
                }}
                className="button button-primary"
              >
                Commencer
              </Link>
            </ul>
          </div>
        </header>
        <main>
          <nav className="button-container">
            <Link
              className="button button-link"
              activeProps={{ className: "button-link-active" }}
              to="/$serieSlug/fiche"
              params={{ serieSlug }}
            >
              Fiche
            </Link>
            <Link
              className="button button-link"
              activeProps={{ className: "button-link-active" }}
              to="/$serieSlug/volumes"
              params={{ serieSlug }}
            >
              Volumes
            </Link>
          </nav>
          <Outlet />
        </main>

        <footer>
          <Ariakit.HeadingLevel>
            <section className="social-networks">
              <Ariakit.Heading>Retrouvez-nous sur nos réseaux</Ariakit.Heading>
              <ul>
                <li>
                  <a href="" target="_blank" rel="noopener noreferre">
                    <PiXLogoBold size={40} />
                  </a>
                </li>
                <li>
                  <a href="" target="_blank" rel="noopener noreferre">
                    <PiInstagramLogoBold size={40} />
                  </a>
                </li>
                <li>
                  <a href="" target="_blank" rel="noopener noreferre">
                    <PiTiktokLogoBold size={40} />
                  </a>
                </li>
              </ul>
            </section>
            <section className="copyrights">
              © 2025 Kuman — Merci de faire partie de l'aventure. Tous droits
              réservés.
              <br />
              <strong>
                Projet réalisé dans le cadre d’un projet scolaire.
              </strong>
            </section>
          </Ariakit.HeadingLevel>
        </footer>
      </div>
    </Ariakit.HeadingLevel>
  );
}
