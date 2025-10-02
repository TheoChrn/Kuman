import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Dialog, DialogHeading } from "~/components/ui/dialog";
import { AddSerieFormModal } from "~/components/serie-form";
import { useTRPC } from "~/trpc/react";
import * as Ariakit from "@ariakit/react";
import { use, useMemo } from "react";
import { Await } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/admin/series/$slug/edit"
)({
  component: RouteComponent,
  loader: ({ context: { queryClient, trpc }, params }) => {
    queryClient.prefetchQuery(
      trpc.mangas.get.queryOptions({ slug: params.slug })
    );
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();

  const trpc = useTRPC();

  const { data: serie } = useSuspenseQuery(
    trpc.mangas.get.queryOptions({ slug })
  );

  return (
    <Dialog backUrl="/admin/series">
      <Ariakit.HeadingLevel>
        <div id="serie-form" className="form-wrapper">
          <DialogHeading>Éditer</DialogHeading>
          <AddSerieFormModal serie={serie} />
        </div>
      </Ariakit.HeadingLevel>
    </Dialog>
  );
}
