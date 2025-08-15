import * as Ariakit from "@ariakit/react";
import {
  publisherFrLabelFrench,
  publisherJpLabelFrench,
  statusLabelFrench,
} from "@kuman/db/enums";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_navigationLayout/_protectedLayout/$serieSlug/_layout/fiche")({
  component: RouteComponent,
});

export function RouteComponent() {
  const trpc = useTRPC();
  const { serieSlug } = Route.useParams();
  const { data: manga } = useSuspenseQuery(
    trpc.mangas.get.queryOptions({ slug: serieSlug })
  );

  return (
    <section className="fiche">
      <Ariakit.HeadingLevel>
        <section>
          <Ariakit.Heading>Synopsis</Ariakit.Heading>
          <p>{manga.synopsis}</p>
        </section>
      </Ariakit.HeadingLevel>
      <Ariakit.HeadingLevel>
        <section>
          <Ariakit.Heading>Nombre de volumes</Ariakit.Heading>
          <span>{manga.tomeCount}</span>
        </section>
      </Ariakit.HeadingLevel>
      <Ariakit.HeadingLevel>
        <section className="genres">
          <Ariakit.Heading>Genres</Ariakit.Heading>
          <ul>
            {manga.genres.map((genre) => (
              <li className="tag" key={genre}>
                {genre}
              </li>
            ))}
          </ul>
        </section>
      </Ariakit.HeadingLevel>
      <Ariakit.HeadingLevel>
        <section className="type">
          <Ariakit.Heading>Type</Ariakit.Heading>
          <span className="tag">{manga.type}</span>
        </section>
      </Ariakit.HeadingLevel>
      <Ariakit.HeadingLevel>
        <section className="other-names">
          <Ariakit.Heading>Autres noms</Ariakit.Heading>
          <ul>
            <li>{manga.originalTitle}</li>
            <li>• {manga.romajiTitle}</li>
            {manga.alternativeTitles && (
              <>
                {manga.alternativeTitles.map((title) => (
                  <li key={title}>• {title}</li>
                ))}
              </>
            )}
          </ul>
        </section>
      </Ariakit.HeadingLevel>
      <Ariakit.HeadingLevel>
        <section>
          <Ariakit.Heading>Date de parution</Ariakit.Heading>
          <span>
            {new Date(manga.releaseDate).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </section>
      </Ariakit.HeadingLevel>
      <Ariakit.HeadingLevel>
        <section>
          <Ariakit.Heading>Éditeurs</Ariakit.Heading>
          <ul>
            <li>{publisherFrLabelFrench[manga.publisherFr]}</li>
            <li>{publisherJpLabelFrench[manga.publisherJp]}</li>
          </ul>
        </section>
      </Ariakit.HeadingLevel>
    </section>
  );
}
