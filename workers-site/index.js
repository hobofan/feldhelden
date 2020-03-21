import { getAssetFromKV, mapRequestToAsset, serveSinglePageApp } from '@cloudflare/kv-asset-handler'

import { handleApiRequest } from '../functions';
import { isValidJwt, getJwt, decodeJwt } from './jwt';
const util = require('util');
const Router = require('./router');

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

function handleOptions(request) {
    const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
  // Make sure the necesssary headers are present
  // for this to be a valid pre-flight request
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check the requested method + headers
    // you can do that here.
    return new Response(null, {
      headers: corsHeaders,
    })
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    })
  }
}

async function handleEvent(event) {
  const router = new Router();

  router.options(".*", () => {
    return handleOptions(event.request);
  })
  const handleApi = async () => {
    let decodedJwt = null;
    if (await isValidJwt(event.request)) {
      decodedJwt = decodeJwt(getJwt(event.request));
    }

    event.request.jwt = decodedJwt;
    console.log(decodedJwt);

    const handleRes = await handleApiRequest(event.request);
    let status = 200;
    if (!handleRes) {
      status = 400;
    }

    return new Response(
      JSON.stringify(handleRes),
      {
        status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  };
  router.get("/api/.*", handleApi);
  router.post("/api/.*", handleApi);
  router.get(".*", async () => {
    const url = new URL(event.request.url)
    let options = {}

    /**
     * You can add custom logic to how we fetch your assets
     * by configuring the function `mapRequestToAsset`
     */
    // options.mapRequestToAsset = handlePrefix(/^\/docs/)
    options.mapRequestToAsset = (req) => {
      const knownRoutes = [
        "/other",
        "/signup",
        "/userdashboard",
        "/farmdashboard",
      ]

      const isInKnownRoutes = knownRoutes.find((n) => new URL(req.url).pathname.startsWith(n));
      if (isInKnownRoutes) {
        return new Request(`${new URL(req.url).origin}/index.html`, req);
      } else {
        return serveSinglePageApp(req);
      }
    };

    try {
      if (DEBUG) {
        // customize caching
        options.cacheControl = {
          bypassCache: true,
        }
      }
      return await getAssetFromKV(event, options)
    } catch (e) {
      // if an error is thrown try to serve the asset at 404.html
      if (!DEBUG) {
        try {
          let notFoundResponse = await getAssetFromKV(event, {
            mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
          })

          return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
        } catch (e) {}
      }

      return new Response(e.message || e.toString(), { status: 500 })
    }
  });

  const resp = await router.route(event.request);
  return resp;
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return request => {
    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request)
    let url = new URL(defaultAssetKey.url)

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, '/')

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey)
  }
}
