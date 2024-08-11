import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { SKLAND_AUTH_URL, SKLAND_HEADER } from './const';

const app = new Hono<{ Bindings: Env }>();

app.get('/', c => c.body('OK', 200));

app.use('*', async (c, next) => {
  const allowOrigins = c.env.ALLOW_ORIGIN?.split(',') || [];
  if (!c.env.IS_DEV && !allowOrigins.includes(c.req.header('origin') || '*')) {
    return c.body(null, 403);
  }
  return await cors({ origin: c.env.IS_DEV ? 'http://localhost:8080' : allowOrigins, maxAge: 3600 })(c, next);
});

app.post('/as.hypergryph.com/user/oauth2/v2/grant', async c => {
  const body = await c.req.json();
  const resp = await fetch(SKLAND_AUTH_URL, {
    method: 'POST',
    headers: SKLAND_HEADER,
    body: JSON.stringify({
      appCode: '4ca99fa6b56cc2ba',
      type: 0,
      ...body,
    }),
  });
  return new Response(resp.body, resp);
});

export default app;
