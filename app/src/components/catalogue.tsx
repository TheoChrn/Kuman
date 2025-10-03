import * as Ariakit from "@ariakit/react";

import { searchParamsSchema } from "@kuman/shared/validators";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { z } from "zod/v4";
import { useTRPC } from "~/trpc/react";

export function Catalogue(props: {
  searchParams: z.infer<typeof searchParamsSchema>;
}) {
  const trpc = useTRPC();

  const { data: collection, isFetching } = useQuery(
    trpc.mangas.getAll.queryOptions(
      { ...props.searchParams },
      { placeholderData: keepPreviousData }
    )
  );

  if (!collection?.length) {
    return (
      <p className="empty-catalogue-state heading-5">
        Aucun résultat ne correspond à votre recherche
      </p>
    );
  }

  return (
    <section className="mangas" data-pending={isFetching}>
      <Ariakit.HeadingLevel>
        {Array.from({ length: 20 }, (_, index) => (
          <Link
            to="/$serieSlug/fiche"
            params={{ serieSlug: collection[0]!.slug }}
            key={index}
          >
            <img src={collection[0]?.coverUrl ?? ""} />
            <div>
              <Ariakit.Heading>{collection[0]!.title}</Ariakit.Heading>
            </div>
          </Link>
        ))}
      </Ariakit.HeadingLevel>
    </section>
  );
}
