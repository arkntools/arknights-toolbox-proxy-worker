import { SKLAND_AUTH_URL, SKLAND_GENERATE_CRED_BY_CODE_URL } from './const';

export interface SklandOauthLoginResp {
  status: number;
  msg: string;
  data: any;
}

export interface SklandApiResp {
  code: number;
  message: string;
  data: any;
}

export const sklandOAuthLogin = (body: Record<string, any>) =>
  fetch(SKLAND_AUTH_URL, {
    method: 'POST',
    headers: {
      'User-Agent': 'Skland/1.5.1 (com.hypergryph.skland; build:100501001; Android 34; ) Okhttp/4.11.0',
      Connection: 'close',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      appCode: '4ca99fa6b56cc2ba',
      type: 0,
      ...body,
    }),
  });

export const sklandGenerateCredByCode = (code: string, dId: string) =>
  fetch(SKLAND_GENERATE_CRED_BY_CODE_URL, {
    body: JSON.stringify({
      code,
      kind: 1,
    }),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      referer: 'https://www.skland.com/',
      origin: 'https://www.skland.com',
      dId,
      platform: '3',
      timestamp: `${Math.floor(Date.now() / 1000)}`,
      vName: '1.0.0',
    },
  });
