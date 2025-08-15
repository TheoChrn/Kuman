import { createFileRoute } from "@tanstack/react-router";
import { AddAChapterRouteComponent } from "~/components/route-components/add-a-chapter";

export const Route = createFileRoute(
  "/_navigationLayout/_protectedLayout/admin/add-a-chapter"
)({
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(trpc.mangas.getAll.queryOptions());
  },
  component: AddAChapterRouteComponent,
});
