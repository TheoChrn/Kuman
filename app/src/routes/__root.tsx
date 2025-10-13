/// <reference types="vite/client" />
import { AppRouter } from "@kuman/api";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TRPCClient } from "@trpc/client";
import { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { User } from "lucia";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary";
import { NotFound } from "~/components/not-found";
import styleUrl from "../styles/global.scss?url";
import { seo } from "~/utils/seo";

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>;
  queryClient: QueryClient;
  trpcClient: TRPCClient<AppRouter>;
  user?: User | null;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Kuman | Lire des mangas en ligne gratuitement",
        description:
          "Kuman est une plateforme de lecture de manga en ligne, fluide, rapide et sans publicité. Découvrez les derniers chapitres traduits en français.",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: styleUrl,
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "canonical", href: "https://theochrn-kuman.netlify.app/" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  beforeLoad: async ({ context }) => {
    if (context.user === undefined) {
      const user = await context.queryClient.ensureQueryData(
        context.trpc.user.getCurrentUser.queryOptions()
      );

      context.user = user;
    }

    return { user: context.user };
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-FR">
      <head>
        <meta charSet="utf-8" />
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
