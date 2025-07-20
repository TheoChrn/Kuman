import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(
      trpc.test.imageUrlBucketExample.queryOptions()
    );
  },
});

function Home() {
  const trpc = useTRPC();
  const { data: bidon } = useSuspenseQuery(
    trpc.test.imageUrlBucketExample.queryOptions()
  );

  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
      <img src={bidon ?? ""} alt="planche manga" />
    </div>
  );
}
