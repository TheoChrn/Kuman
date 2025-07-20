import { jsxs, jsx } from 'react/jsx-runtime';
import { useSuspenseQuery } from '@tanstack/react-query';
import { u as useTRPC } from './ssr.mjs';
import '@tanstack/react-router';
import '@tanstack/react-router-with-query';
import '@trpc/client';
import '@trpc/tanstack-react-query';
import 'superjson';
import '@tanstack/react-query-devtools';
import '@tanstack/react-router-devtools';
import 'zod/v4';
import 'path';
import 'url';
import 'fs';
import 'os';
import 'crypto';
import 'node:crypto';
import 'pg';
import 'stream';
import 'http';
import 'punycode';
import 'https';
import 'zlib';
import 'events';
import 'net';
import 'tls';
import 'buffer';
import '@trpc/server';
import '@trpc/server/adapters/fetch';
import 'node:async_hooks';
import '@tanstack/react-router/ssr/server';

const SplitComponent = function Home() {
  const trpc = useTRPC();
  const {
    data: bidon
  } = useSuspenseQuery(trpc.test.imageUrlBucketExample.queryOptions());
  return /* @__PURE__ */ jsxs("div", { className: "p-2", children: [
    /* @__PURE__ */ jsx("h3", { children: "Welcome Home!!!" }),
    /* @__PURE__ */ jsx("img", { src: bidon != null ? bidon : "", alt: "planche manga" })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=index-B6VaOZMD.mjs.map
