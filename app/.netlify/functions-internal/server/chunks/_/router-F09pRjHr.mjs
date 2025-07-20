import { c as createServerRpc, a as createServerFn, g as getWebRequest } from './ssr.mjs';
import 'react/jsx-runtime';
import '@tanstack/react-query';
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

const getRequestHeaders_createServerFn_handler = createServerRpc("src_router_tsx--getRequestHeaders_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getRequestHeaders.__executeServer(opts, signal);
});
const getRequestHeaders = createServerFn({
  method: "GET"
}).handler(getRequestHeaders_createServerFn_handler, async () => {
  const request = getWebRequest();
  const headers = new Headers(request.headers);
  return Object.fromEntries(headers);
});

export { getRequestHeaders_createServerFn_handler };
//# sourceMappingURL=router-F09pRjHr.mjs.map
