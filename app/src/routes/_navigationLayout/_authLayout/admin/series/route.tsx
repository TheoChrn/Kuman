import * as Ariakit from "@ariakit/react";
import { role } from "@kuman/db/enums";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { PiCaretDown, PiPencil, PiPlus } from "react-icons/pi";
import { LoadingSpinner } from "~/components/loading-spinner";
import { useTRPC } from "~/trpc/react";
import { seo } from "~/utils/seo";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/admin/series"
)({
  head: () => ({
    meta: [
      ...seo({
        title: "Kuman | Administration - Séries",
      }),
    ],
  }),
  beforeLoad: ({ context: { user } }) => {
    if (user!.role !== role.ADMINISTRATOR) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
  loader: ({ context: { queryClient, trpc } }) => {
    queryClient.prefetchQuery(trpc.mangas.getAll.queryOptions());
  },
});

function RouteComponent() {
  const trpc = useTRPC();

  const { data: library } = useSuspenseQuery(trpc.mangas.getAll.queryOptions());

  return (
    <>
      <div id="admin">
        <Link
          resetScroll={false}
          to="/admin/series/add"
          className="button add-new-resource"
        >
          <PiPlus size={24} /> Ajouter une série
        </Link>
        {library.map((serie) => (
          <div key={serie.id} className="disclosure-wrapper">
            <Ariakit.DisclosureProvider>
              <Ariakit.Disclosure className="disclosure">
                {serie.coverUrl && (
                  <img
                    height={160}
                    width={100}
                    src={serie.coverUrl}
                    alt={`Illustration ${serie.title}`}
                  />
                )}
                <Ariakit.Heading className="heading-6">
                  {serie.title}
                </Ariakit.Heading>
                <div className="actions">
                  <Link
                    resetScroll={false}
                    to="/admin/series/$slug/edit"
                    params={{ slug: serie.slug }}
                    className="button button-outline"
                  >
                    <PiPencil size={24} />
                    <Ariakit.VisuallyHidden>
                      Éditer une série
                    </Ariakit.VisuallyHidden>
                  </Link>
                  <PiCaretDown size={24} className="caret" />
                </div>
              </Ariakit.Disclosure>
              <Ariakit.DisclosureContent className="disclosure-content">
                <Ariakit.HeadingLevel>
                  <Comp slug={serie.slug} />
                </Ariakit.HeadingLevel>
              </Ariakit.DisclosureContent>
            </Ariakit.DisclosureProvider>
          </div>
        ))}
      </div>

      <Suspense
        fallback={<LoadingSpinner className="loading-spinner-absolute" />}
      >
        <Outlet />
      </Suspense>
    </>
  );
}

function Comp(props: { slug: string }) {
  const trpc = useTRPC();
  const { data: volumes } = useSuspenseQuery(
    trpc.chapters.getAllFromSerieGrouppedByVolume.queryOptions({
      serie: props.slug,
    })
  );

  return (
    <div>
      <Link
        resetScroll={false}
        to="/admin/series/$serieSlug/volume/add"
        params={{ serieSlug: props.slug }}
        className="button add-new-resource"
      >
        <PiPlus size={24} />
        Ajouter un volume
      </Link>
      <ul>
        {volumes.map((volume) => (
          <li key={volume.volumeNumber} className="disclosure-wrapper">
            <Ariakit.DisclosureProvider>
              <Ariakit.Disclosure className="disclosure">
                {volume.coverImageUrl && (
                  <img
                    height={160}
                    width={100}
                    src={volume.coverImageUrl}
                    alt={`Illustration ${volume.title}`}
                  />
                )}
                <Ariakit.Heading className="heading-7">
                  Volume {volume.volumeNumber}
                </Ariakit.Heading>
                <div className="actions">
                  <Link
                    resetScroll={false}
                    to="/admin/series/$serieSlug/$volume/edit"
                    params={{
                      serieSlug: props.slug,
                      volume: volume.volumeNumber.toString(),
                    }}
                    className="button button-outline"
                  >
                    <PiPencil size={24} />
                    <Ariakit.VisuallyHidden>
                      Éditer un volume
                    </Ariakit.VisuallyHidden>
                  </Link>
                  <PiCaretDown size={24} className="caret" />
                </div>
              </Ariakit.Disclosure>
              <Ariakit.DisclosureContent className="disclosure-content">
                <Ariakit.HeadingLevel>
                  <div>
                    <Link
                      resetScroll={false}
                      to="/admin/series/$serieSlug/$volume/chapter/add"
                      params={{
                        serieSlug: props.slug,
                        volume: volume.volumeNumber.toString(),
                      }}
                      className="button add-new-resource"
                    >
                      <PiPlus size={24} />
                      Ajouter un chapitre
                    </Link>

                    {volume.chapters.length ? (
                      <ul className="chapter-list">
                        {volume.chapters.map((chapter) => (
                          <li key={chapter.number}>
                            <div>
                              <span className="chapter-number">
                                {chapter.number}
                              </span>
                              <div>
                                <Ariakit.Heading className="text">
                                  {chapter.name}
                                </Ariakit.Heading>
                                <span>{chapter.pageCount} pages</span>
                              </div>
                            </div>
                            <div className="actions">
                              <Link
                                resetScroll={false}
                                to="/admin/series/$serieSlug/$volume/$chapter/edit"
                                params={{
                                  serieSlug: props.slug,
                                  chapter: chapter.number.toString(),
                                  volume: volume.volumeNumber.toString(),
                                }}
                                className="button button-outline"
                              >
                                <PiPencil size={24} />
                                <Ariakit.VisuallyHidden>
                                  Éditer une série
                                </Ariakit.VisuallyHidden>
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </Ariakit.HeadingLevel>
              </Ariakit.DisclosureContent>
            </Ariakit.DisclosureProvider>
          </li>
        ))}
      </ul>
    </div>
  );
}
