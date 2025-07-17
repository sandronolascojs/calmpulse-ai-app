/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'calmpulse-app',
      stage: input?.stage ?? 'dev',
      home: 'aws',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      providers: {
        aws: {
          region: 'us-east-1',
          profile: 'sst',
        },
      },
    };
  },

  async run() {
    const { env } = await import('@/config/env.config');
    const { APP_CONFIG } = await import('@calmpulse-app/types');

    const APP_NAME = APP_CONFIG.basics.name.toLowerCase().replace(/\s+/g, '-');
    const ROOT = env.FRONTEND_URL; // calmpulse.app
    const API_ZONE = `api.${ROOT}`; // api.calmpulse.app   (zone Route 53)
    const APP_ZONE = `app.${ROOT}`; // app.calmpulse.app   (zone Route 53)

    const API_DOMAIN = $app.stage === 'production' ? `${API_ZONE}` : `${$app.stage}.${API_ZONE}`;
    const FRONT_DOMAIN = $app.stage === 'production' ? `${APP_ZONE}` : `${$app.stage}.${APP_ZONE}`;
    const FRONT_ORIGIN =
      $app.stage === 'production' ? `https://${APP_ZONE}` : `https://${$app.stage}.${APP_ZONE}`;

    const DB_NAME = `${$app.stage}-${APP_NAME}-db`;
    const VPC_NAME = `${$app.stage}-${APP_NAME}-vpc`;
    const API_NAME = `${$app.stage}-${APP_NAME}-api`;
    const CLUSTER_NAME = `${$app.stage}-${APP_NAME}-cluster`;
    const FRONTEND_NAME = `${$app.stage}-${APP_NAME}-frontend`;

    const vpc = new sst.aws.Vpc(VPC_NAME, {
      bastion: true,
      nat: 'ec2',
    });

    const db = new sst.aws.Postgres(
      DB_NAME,
      {
        vpc,
        instance: 't4g.micro',
        storage: '20 GB',
        proxy: false,
      },
      {
        version: '16.x',
      },
    );

    const api = new sst.aws.ApiGatewayV2(API_NAME, {
      vpc,
      domain: {
        name: API_DOMAIN,
        dns: sst.cloudflare.dns(),
      },
      cors: {
        allowOrigins: [FRONT_ORIGIN],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        allowCredentials: true,
        maxAge: '1 day',
      },
    });

    api.route('ANY /{proxy+}', {
      handler: '../../services/api/dist/index.handler',
      vpc,
      link: [db],
      runtime: 'nodejs22.x',
      environment: {
        APP_ENV: $app.stage,
        DATABASE_URL: $interpolate`postgresql://${db.username}:${db.password}@${db.host}:${db.port}/${db.database}`,
        ALLOWED_ORIGINS: FRONT_ORIGIN,
        FRONTEND_URL: $interpolate`https://${FRONT_DOMAIN}`,
        API_BASE_URL: $interpolate`https://${API_DOMAIN}`,

        // slack
        SLACK_CLIENT_ID: env.SLACK_CLIENT_ID,
        SLACK_CLIENT_SECRET: env.SLACK_CLIENT_SECRET,
        OAUTH_SCOPES: env.OAUTH_SCOPES,

        // auth
        BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: $interpolate`https://${API_DOMAIN}`,

        // email
        RESEND_API_KEY: env.RESEND_API_KEY,
        FROM_EMAIL: env.FROM_EMAIL,

        // google credentials
        GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
      },
    });

    const frontend = new sst.aws.Nextjs(FRONTEND_NAME, {
      path: '../../apps/frontend',
      domain: {
        name: FRONT_DOMAIN,
        dns: sst.cloudflare.dns(),
      },
      environment: {
        NEXT_PUBLIC_API_URL: $interpolate`https://${API_DOMAIN}`,
        NEXT_PUBLIC_AUTH_API_URL: $interpolate`https://${API_DOMAIN}/api/auth`,
        NEXT_PUBLIC_FRONTEND_URL: $interpolate`https://${FRONT_DOMAIN}`,
      },
    });

    return {
      ApiUrl: api.url,
      DbHost: db.host,
      DbUser: db.username,
      DbName: db.database,
      FrontendUrl: frontend.url,
    };
  },
});
