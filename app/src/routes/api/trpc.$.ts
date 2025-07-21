import { appRouter, createTRPCContext } from "@kuman/api";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: () => createTRPCContext(request),
  });
}

export const ServerRoute = createServerFileRoute("/api/trpc/$").methods({
  GET: handler,
  POST: handler,
});
