import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_navigationLayout/_authLayout/admin/series/$serieSlug/volume"
)({
  component: RouteComponent,
  loader: async ({ context: { queryClient, trpc }, params }) => {
    queryClient.prefetchQuery(
      trpc.mangas.get.queryOptions({ slug: params.serieSlug })
    );
  },
});

function RouteComponent() {
  return (
    <div>
      Hello "/_navigationLayout/_authLayout/admin/series/$serieSlug/volume"!
    </div>
  );
}
