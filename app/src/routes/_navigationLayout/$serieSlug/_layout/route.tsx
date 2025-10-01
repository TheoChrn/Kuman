import * as Ariakit from "@ariakit/react";
import { statusLabelFrench } from "@kuman/db/enums";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Footer } from "~/components/footer";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_navigationLayout/$serieSlug/_layout")({
  loader: async ({ context: { trpc, queryClient }, params: { serieSlug } }) => {
    await Promise.all([
      queryClient.prefetchQuery(
        trpc.mangas.get.queryOptions({ slug: serieSlug })
      ),
      queryClient.prefetchQuery(
        trpc.chapters.getAll.queryOptions({ serie: serieSlug })
      ),
    ]);
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
              <Link
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
        <Footer />
      </Ariakit.HeadingLevel>
    </div>
  );
}
