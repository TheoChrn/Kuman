import * as Ariakit from "@ariakit/react";
import { role } from "@kuman/db/enums";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { PiBookmarkSimpleDuotone, PiMagnifyingGlassBold } from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";
import { useTRPC } from "~/trpc/react";
import { typeIcons } from "~/utils/icons/typeIcons";
import { seo } from "~/utils/seo";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/bookmarks/"
)({
  head: () => ({
    meta: [
      ...seo({
        title: "Kuman | Favoris",
      }),
    ],
  }),
  component: RouteComponent,
  beforeLoad: async ({ context: { user } }) => {
    if (user!.role === role.USER) {
      throw new TRPCClientError(
        "Vous devez être abonné pour suivre vos mangas"
      );
    }
  },
  loader: ({ context: { trpc, queryClient } }) => {
    queryClient.prefetchQuery(trpc.bookmarks.getMany.queryOptions());
  },
  pendingComponent: () => {
    return <div>Pending</div>;
  },
});

function RouteComponent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: bookmarks } = useSuspenseQuery(
    trpc.bookmarks.getMany.queryOptions()
  );

  const removeFromBookmarks = useMutation(
    trpc.bookmarks.delete.mutationOptions({
      onMutate: async (variables) => {
        await queryClient.cancelQueries(trpc.bookmarks.getMany.pathFilter());

        const initialBookmarks = queryClient.getQueryData(
          trpc.bookmarks.getMany.queryKey()
        );

        if (!initialBookmarks) return;

        const filteredInitialBookmarks = initialBookmarks.filter(
          (bookmark) => bookmark.slug !== variables.mangaSlug
        );

        queryClient.setQueryData(
          trpc.bookmarks.getMany.queryKey(),
          filteredInitialBookmarks
        );

        return { initialBookmarks };
      },
      onError: (_, __, context) => {
        if (!context) return;
        queryClient.setQueryData(
          trpc.bookmarks.getMany.queryKey(),
          context.initialBookmarks
        );
      },
      onSettled: (_, __, ___, context) => {
        if (!context) return;
        queryClient.invalidateQueries(trpc.bookmarks.getMany.pathFilter());
      },
    })
  );

  if (!bookmarks.length) {
    return (
      <Ariakit.HeadingLevel>
        <Ariakit.VisuallyHidden>
          <Ariakit.Heading>Bookmarks</Ariakit.Heading>
        </Ariakit.VisuallyHidden>
        <div id="bookmarks" className="empty">
          <p>Vous n'avez pas encore commencer de série.</p>
          <Link to="/catalogue" className="button button-primary">
            <PiMagnifyingGlassBold /> Explorez le catalogue
          </Link>
        </div>
      </Ariakit.HeadingLevel>
    );
  }

  return (
    <Ariakit.HeadingLevel>
      <div id="bookmarks">
        <Ariakit.Heading>Mes Favoris</Ariakit.Heading>

        <section className="bookmarks">
          {bookmarks.map((manga) => {
            return (
              <Ariakit.HeadingLevel key={manga.slug}>
                <Link
                  to="/$serieSlug/chapter/$chapterNumber/$page"
                  params={{
                    chapterNumber: manga.currentChapter.toString(),
                    page: manga.currentPage.toString(),
                    serieSlug: manga.slug,
                  }}
                >
                  <img src={manga.coverUrl ?? ""} />
                  <div className="overlay">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromBookmarks.mutate({ mangaSlug: manga.slug });
                      }}
                    >
                      <PiBookmarkSimpleDuotone size={24} />
                      <Ariakit.VisuallyHidden>
                        Retirer des favoris
                      </Ariakit.VisuallyHidden>
                    </Button>
                  </div>
                  <Ariakit.Heading>{manga.title}</Ariakit.Heading>
                  <div className={`tag tag-${manga.type}`}>
                    {typeIcons[manga.type]}
                    <span>{manga.type}</span>
                  </div>
                </Link>
              </Ariakit.HeadingLevel>
            );
          })}
        </section>
      </div>
    </Ariakit.HeadingLevel>
  );
}
