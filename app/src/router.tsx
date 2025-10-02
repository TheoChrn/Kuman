import { AppRouter } from "@kuman/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  splitLink,
} from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { TRPCProvider } from "~/trpc/react";
import { DefaultCatchBoundary } from "./components/default-catch-boundary";
import { NotFound } from "./components/not-found";
import { routeTree } from "./routeTree.gen";
import { getRequestHeaders } from "@tanstack/react-start/server";

const getIncomingHeaders = createIsomorphicFn().server(() =>
  getRequestHeaders()
);

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    return `${import.meta.env.VITE_BASE_URL || "http://localhost:3000"}`;
  })();
  return base + "/api/trpc";
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000 },
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  });

  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      splitLink({
        condition: (op) => isNonJsonSerializable(op.input),
        true: httpLink({
          headers: getIncomingHeaders(),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
          url: getUrl(),
          transformer: {
            input: {
              serialize: (data: unknown) => data,
              deserialize: (data: unknown) => data,
            },
            output: {
              serialize: superjson.serialize,
              deserialize: superjson.deserialize,
            },
          },
        }),
        false: httpBatchLink({
          headers: getIncomingHeaders(),
          transformer: superjson,
          url: getUrl(),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      }),
    ],
  });

  const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
  });

  const router = routerWithQueryClient(
    createTanStackRouter({
      scrollRestoration: true,
      routeTree,
      context: { trpc, queryClient, caller: trpcClient },
      defaultPreload: "intent",
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => <NotFound />,
      defaultPendingComponent: () => <div>LOADING</div>,
      Wrap: function WrapComponent({ children }) {
        return (
          <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </TRPCProvider>
        );
      },
    }),
    queryClient
  );

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
