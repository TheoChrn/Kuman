import * as Ariakit from "@ariakit/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PiCaretDown } from "react-icons/pi";
import { useTRPC } from "~/trpc/react";
import { seo } from "~/utils/seo";

export const Route = createFileRoute(
  "/_navigationLayout/$serieSlug/_layout/volumes"
)({
  head: () => ({
    meta: [
      ...seo({
        title: "Kuman | Volumes",
      }),
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const { serieSlug } = Route.useParams();

  const { data: volumes } = useSuspenseQuery(
    trpc.chapters.getAllFromSerieGrouppedByVolume.queryOptions({
      serie: serieSlug,
    })
  );

  if (!volumes.length) {
    return (
      <section id="volumes">
        <Ariakit.HeadingLevel>
          <Ariakit.Heading className="fallback-message">
            Aucun volume n'a encore été publié.
          </Ariakit.Heading>
        </Ariakit.HeadingLevel>
      </section>
    );
  }

  return (
    <Ariakit.HeadingLevel>
      <section id="volumes">
        <Ariakit.VisuallyHidden render={<Ariakit.Heading />}>
          Volumes
        </Ariakit.VisuallyHidden>
        <ul>
          <Ariakit.HeadingLevel>
            {volumes.map((volume) => (
              <li className="volume-group" key={volume.volumeNumber}>
                <Ariakit.DisclosureProvider>
                  <Ariakit.Disclosure className="volume-card">
                    {volume.coverImageUrl && (
                      <img
                        height={160}
                        width={100}
                        src={volume.coverImageUrl}
                        alt={`Illustration ${volume.title}`}
                      />
                    )}
                    <div>
                      <Ariakit.Heading>
                        Volume {volume.volumeNumber}
                      </Ariakit.Heading>
                      <p>{volume.summary}</p>
                      {volume.chapters.length ? (
                        <span className="chapter-range">
                          Chapitres {volume.chapters[0]!.number} à{" "}
                          {
                            volume.chapters[volume.chapters.length - 1]!.number
                          }{" "}
                        </span>
                      ) : null}
                    </div>
                    <PiCaretDown className="volume-caret" size={24} />
                  </Ariakit.Disclosure>
                  <Ariakit.DisclosureContent className="chapters">
                    <Ariakit.HeadingLevel>
                      <ul>
                        {volume.chapters.length
                          ? volume.chapters.map((chapter) => (
                              <li key={chapter.number}>
                                <Link
                                  to="/$serieSlug/chapter/$chapterNumber/$page"
                                  params={{
                                    chapterNumber: String(chapter.number),
                                    page: "1",
                                    serieSlug,
                                  }}
                                  className="chapter-link"
                                >
                                  <span className="chapter-number">
                                    {chapter.number}
                                  </span>
                                  <div>
                                    <Ariakit.Heading>
                                      {chapter.name}
                                    </Ariakit.Heading>
                                    <span className="chapter-page-count">
                                      {chapter.pageCount} pages
                                    </span>
                                  </div>
                                </Link>
                              </li>
                            ))
                          : null}
                      </ul>
                    </Ariakit.HeadingLevel>
                  </Ariakit.DisclosureContent>
                </Ariakit.DisclosureProvider>
              </li>
            ))}
          </Ariakit.HeadingLevel>
        </ul>
      </section>
    </Ariakit.HeadingLevel>
  );
}
