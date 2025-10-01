import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useTRPC } from "~/trpc/react";
import * as Ariakit from "@ariakit/react";
import { PiCaretDown, PiPencil, PiPlus } from "react-icons/pi";
import { Button } from "~/components/ui/buttons/button";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/admin/series"
)({
  beforeLoad: ({ context: { user } }) => {
    if (user!.role !== "administrator") {
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
        <Link to="/admin/series/add" className="button add-new-resource">
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
      <Outlet />
    </>
  );
}

function Comp(props: { slug: string }) {
  const trpc = useTRPC();
  const { data: volumes } = useSuspenseQuery(
    trpc.chapters.getAll.queryOptions({ serie: props.slug })
  );

  return (
    <div>
      <Link className="button add-new-resource">
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
                <PiCaretDown size={24} className="caret" />
              </Ariakit.Disclosure>
              <Ariakit.DisclosureContent className="disclosure-content">
                <Ariakit.HeadingLevel>
                  <div>
                    <Link className="button add-new-resource">
                      <PiPlus size={24} />
                      Ajouter un chapitre
                    </Link>

                    {volume.chapters.length ? (
                      <ul className="chapter-list">
                        {volume.chapters.map((chapter) => (
                          <li key={chapter.number}>
                            <span className="chapter-number">
                              {chapter.number}
                            </span>
                            <div>
                              <Ariakit.Heading className="text">
                                {chapter.name}
                              </Ariakit.Heading>
                              <span>{chapter.pageCount} pages</span>
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
