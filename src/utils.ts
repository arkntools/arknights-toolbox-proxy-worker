export const createProxyResponse = (resp: Response, body?: BodyInit) => {
  const newResp = new Response(body ?? resp.body, resp);
  newResp.headers.delete('set-cookie');
  return newResp;
};
