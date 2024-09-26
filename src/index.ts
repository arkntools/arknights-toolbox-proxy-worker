import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { SklandApiResp, sklandGenerateCredByCode, sklandOAuthLogin, SklandOauthLoginResp } from './skland';
import { createProxyResponse } from './utils';

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
  const resp = await sklandOAuthLogin(await c.req.json());
  return createProxyResponse(resp);
});

app.post('/skland/oauth_combine', async c => {
  const resp = await sklandOAuthLogin(await c.req.json());
  const data: SklandOauthLoginResp = await resp.json();
  if (data.status !== 0) {
    return createProxyResponse(
      resp,
      JSON.stringify({
        code: data.status,
        message: data.msg,
        data: data.data,
      } satisfies SklandApiResp),
    );
  }
  const resp2 = await sklandGenerateCredByCode(data.data.code, c.env.SKLAND_DID);
  return createProxyResponse(resp2);
});

export default app;
