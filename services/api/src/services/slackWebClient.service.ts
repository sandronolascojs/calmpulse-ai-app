import { env } from "@/config/env.config";
import { LogLevel, WebClient } from "@slack/web-api";

export class SlackWebClientService {
  private webClient: WebClient;

  constructor(accessToken: string | undefined) {
    this.webClient = new WebClient(accessToken, { logLevel: LogLevel.ERROR });
  }

  async oauthV2Access({ code, redirectUri }: {code: string, redirectUri: string}) {
    const response = await this.webClient.oauth.v2.access({
      client_id: env.SLACK_CLIENT_ID,
      client_secret: env.SLACK_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    });

    return response;
  }
}