import * as Ariakit from "@ariakit/react";
import { statusLabelFrench } from "@kuman/db/enums";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Footer } from "~/components/footer";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_navigationLayout/$serieSlug/_layout")({
  loader: ({ context: { trpc, queryClient }, params: { serieSlug } }) => {
    queryClient.prefetchQuery(
      trpc.mangas.get.queryOptions({ slug: serieSlug })
    );
    queryClient.prefetchQuery(
      trpc.chapters.getAllFromSerieGrouppedByVolume.queryOptions({
        serie: serieSlug,
      })
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const { serieSlug } = Route.useParams();
  const { data: manga } = useSuspenseQuery(
    trpc.mangas.get.queryOptions({ slug: serieSlug })
  );
  const { data: volumes } = useSuspenseQuery(
    trpc.chapters.getAllFromSerieGrouppedByVolume.queryOptions({
      serie: serieSlug,
    })
  );

  return (
    <div id="serie">
      <Ariakit.HeadingLevel>
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
              {!!volumes[0]?.chapters.length && (
                <Link
                  resetScroll={false}
                  to="/$serieSlug/chapter/$chapterNumber/$page"
                  params={{
                    chapterNumber: manga.currentChapter?.toString() ?? "1",
                    page: manga.currentPage?.toString() ?? "1",
                    serieSlug: manga.slug,
                  }}
                  className="button button-primary"
                >
                  {manga.currentChapter ? "Continuer" : "Commencer"}
                </Link>
              )}
            </ul>
          </div>
        </header>
        <nav className="button-container">
          <Link
            resetScroll={false}
            className="button button-link"
            activeProps={{ className: "button-link-active" }}
            to="/$serieSlug/fiche"
            params={{ serieSlug }}
          >
            Fiche
          </Link>
          <Link
            resetScroll={false}
            className="button button-link"
            activeProps={{ className: "button-link-active" }}
            to="/$serieSlug/volumes"
            params={{ serieSlug }}
          >
            Volumes
          </Link>
          <Link
            resetScroll={false}
            className="button button-link"
            activeProps={{ className: "button-link-active" }}
            to="/$serieSlug/avis"
            params={{ serieSlug }}
          >
            Avis
          </Link>
        </nav>
        <main>
          <Outlet />
        </main>
        <Footer />
      </Ariakit.HeadingLevel>
    </div>
  );
}
