import { createFileRoute } from "@tanstack/react-router";
import { Dialog, DialogHeading } from "~/components/ui/dialog";
import * as Ariakit from "@ariakit/react";
import { ChapterForm } from "~/components/chapter-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/admin/series/$serieSlug/$volume/$chapter/edit"
)({
  component: RouteComponent,
  loader: async ({ context: { queryClient, trpc }, params }) => {
    queryClient.prefetchQuery(
      trpc.chapters.getChapterAdminProcedure.queryOptions({
        chapterNumber: Number(params.chapter),
        serie: params.serieSlug,
      })
    );
  },
});

function RouteComponent() {
  const trpc = useTRPC();
  const params = Route.useParams();

  const { data: chapter } = useSuspenseQuery(
    trpc.chapters.getChapterAdminProcedure.queryOptions({
      chapterNumber: Number(params.chapter),
      serie: params.serieSlug,
    })
  );

  return (
    <Dialog backUrl="/admin/series">
      <Ariakit.HeadingLevel>
        <div id="chapter-form" className="form-wrapper">
          <DialogHeading>Ajouter un chapitre</DialogHeading>
          <ChapterForm chapter={chapter} serieSlug={params.serieSlug} />
        </div>
      </Ariakit.HeadingLevel>
    </Dialog>
  );
}
