import { createFileRoute } from "@tanstack/react-router";
import { AddATomeRouteComponent } from "~/components/route-components/add-a-volume";

export const Route = createFileRoute("/_navigationLayout/_authLayout/admin/add-a-volume")({
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(trpc.mangas.getAll.queryOptions());
  },
  component: AddATomeRouteComponent,
});
