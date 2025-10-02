import { createFileRoute } from "@tanstack/react-router";
import { Dialog, DialogHeading } from "~/components/ui/dialog";
import * as Ariakit from "@ariakit/react";
import { ChapterForm } from "~/components/chapter-form";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/admin/series/$serieSlug/$volume/chapter/add"
)({
  component: RouteComponent,
  loader: async ({ context: { queryClient, trpc }, params }) => {
    queryClient.prefetchQuery(
      trpc.mangas.get.queryOptions({ slug: params.serieSlug })
    );
  },
});

function RouteComponent() {
  const params = Route.useParams();
  return (
    <Dialog backUrl="/admin/series">
      <Ariakit.HeadingLevel>
        <div id="chapter-form" className="form-wrapper">
          <DialogHeading>Éditer</DialogHeading>
          <ChapterForm serieSlug={params.serieSlug} />
        </div>
      </Ariakit.HeadingLevel>
    </Dialog>
  );
}
