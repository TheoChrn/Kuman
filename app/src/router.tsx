import { AppRouter } from "@kuman/api";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";
import { TRPCProvider } from "~/trpc/react";
import { DefaultCatchBoundary } from "./components/default-catch-boundary";
import { NotFound } from "./components/not-found";
import { routeTree } from "./routeTree.gen";
// NOTE: Most of the integration code found here is experimental and will
// definitely end up in a more streamlined API in the future. This is just
// to show what's possible with the current APIs.

const getRequestHeaders = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest()!;
    const headers = new Headers(request.headers);

    return Object.fromEntries(headers);
  }
);

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    return `${import.meta.env.VITE_BASE_URL || "http://localhost:3000"}`;
  })();
  return base + "/api/trpc";
}

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000 },
      dehydrate: { serializeData: SuperJSON.serialize },
      hydrate: { deserializeData: SuperJSON.deserialize },
    },
  });

  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        transformer: SuperJSON,
        url: getUrl(),
        async headers() {
          return await getRequestHeaders();
        },
      }),
    ],
  });

  const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
  });

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { trpc, queryClient },
      defaultPreload: "intent",
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => <NotFound />,
      defaultPendingComponent: () => (
        <div className={`p-2 text-2xl`}>LOADING</div>
      ),
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
    router: ReturnType<typeof createRouter>;
  }
}
