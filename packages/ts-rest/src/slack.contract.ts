import { errorsSchema } from '@calmpulse-app/types';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const oauthErrorCodes = z.union([
  z.literal('bad_client_secret'),
  z.literal('bad_redirect_uri'),
  z.literal('cannot_install_an_org_installed_app'),
  z.literal('invalid_client_id'),
  z.literal('invalid_code'),
  z.literal('invalid_grant_type'),
  z.literal('invalid_refresh_token'),
  z.literal('no_scopes'),
  z.literal('oauth_authorization_url_mismatch'),
  z.literal('preview_feature_not_available'),
  z.literal('user_email_unverified'),
  z.literal('accesslimited'),
  z.literal('fatal_error'),
  z.literal('internal_error'),
  z.literal('invalid_arg_name'),
  z.literal('invalid_arguments'),
  z.literal('invalid_array_arg'),
  z.literal('invalid_charset'),
  z.literal('invalid_form_data'),
  z.literal('invalid_post_type'),
  z.literal('missing_post_type'),
  z.literal('ratelimited'),
  z.literal('request_timeout'),
  z.literal('service_unavailable'),
  z.literal('team_added_to_org'),
  z.literal('missing_charset'),
  z.literal('superfluous_charset'),
]);

const oauthFailure = z.object({
  ok: z.literal(false),
  error: oauthErrorCodes,
});

const c = initContract();

export const slackRouter = c.router({
  install: {
    method: 'GET',
    path: '/slack/install',
    responses: {
      200: z.object({
        ok: z.literal(true),
        redirectUrl: z.string(),
      }),
      ...errorsSchema,
    },
  },
  oauthCallback: {
    method: 'GET',
    path: '/slack/oauth/callback',
    query: z.object({ code: z.string(), state: z.string() }),
    responses: {
      200: z.undefined(),
      302: z.object({ location: z.string() }),
      400: oauthFailure,
      ...errorsSchema,
    },
  },
});
