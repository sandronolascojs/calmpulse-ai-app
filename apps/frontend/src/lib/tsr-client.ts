import { env } from '@/config/env';
import { contract } from '@calmpulse-app/ts-rest';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { auth } from './auth';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export const tsrClient = initTsrReactQuery(contract, {
  baseUrl: API_BASE_URL,
  baseHeaders: {
    'Content-Type': 'application/json',
    Authorization: () => {
      const accessToken = auth.getSession().then((session) => session.data?.session.token);
      return accessToken ? `Bearer ${accessToken}` : '';
    },
  },
});
