import * as Ariakit from "@ariakit/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Dialog, DialogHeading } from "~/components/ui/dialog";
import { VolumeForm } from "~/components/volume-form";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/admin/series/$serieSlug/$volume/edit"
)({
  component: RouteComponent,
  loader: async ({ context: { queryClient, trpc }, params }) => {
    queryClient.prefetchQuery(
      trpc.volumes.get.queryOptions({
        serieSlug: params.serieSlug,
        volume: Number(params.volume),
      })
    );
  },
});

function RouteComponent() {
  const params = Route.useParams();

  const trpc = useTRPC();

  const { data: volume } = useSuspenseQuery(
    trpc.volumes.get.queryOptions({
      serieSlug: params.serieSlug,
      volume: Number(params.volume),
    })
  );
  return (
    <Dialog backUrl="/admin/series">
      <Ariakit.HeadingLevel>
        <div id="volume-form" className="form-wrapper">
          <DialogHeading>Éditer</DialogHeading>
          <VolumeForm volume={volume} />
        </div>
      </Ariakit.HeadingLevel>
    </Dialog>
  );
}
