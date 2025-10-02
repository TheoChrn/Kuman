import { appRouter, createTRPCContext } from "@kuman/api";
import { createFileRoute } from "@tanstack/react-router";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export async function handler({ request }: { request: Request }) {
  return await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: ({ req, resHeaders }) =>
      createTRPCContext({ req, resHeaders }),
    onError: ({ path, error }) => {
      console.error(
        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
      );
    },
  });
}

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
