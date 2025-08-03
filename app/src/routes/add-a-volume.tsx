import { createFileRoute } from "@tanstack/react-router";
import { AddATomeRouteComponent } from "~/components/route-components/add-a-volume";

export const Route = createFileRoute("/add-a-volume")({
  loader: async ({ context: { trpc, queryClient } }) => {
    queryClient.ensureQueryData(trpc.mangas.getAll.queryOptions());
  },
  component: AddATomeRouteComponent,
});
