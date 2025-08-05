import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const trpc = useTRPC();

  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
    </div>
  );
}
