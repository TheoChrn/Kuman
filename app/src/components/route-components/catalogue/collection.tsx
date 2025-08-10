import * as Ariakit from "@ariakit/react";

import { searchParamsSchema } from "@kuman/shared/validators";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { z } from "zod/v4";
import { useTRPC } from "~/trpc/react";

export function Collection(props: {
  searchParams: z.infer<typeof searchParamsSchema>;
}) {
  const trpc = useTRPC();

  const { data: collection } = useSuspenseQuery(
    trpc.mangas.getAll.queryOptions({ ...props.searchParams })
  );

  if (!collection.length) {
    return "Aucun résultat";
  }

  return (
    <>
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
    </>
  );
}
