import { env } from '@/config/env.config';
import { LogLevel, WebClient } from '@slack/web-api';

export class SlackWebClientService {
  private createWebClient(accessToken?: string) {
    return new WebClient(accessToken, { logLevel: LogLevel.ERROR });
  }

  async oauthV2Access({ code, redirectUri }: { code: string; redirectUri: string }) {
    const webClient = this.createWebClient();
    const response = await webClient.oauth.v2.access({
      client_id: env.SLACK_CLIENT_ID,
      client_secret: env.SLACK_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    });

    return response;
  }

  async getTeamInfo(accessToken: string) {
    const webClient = this.createWebClient(accessToken);
    const response = await webClient.team.info();
    return response;
  }

  async getUsers(accessToken: string) {
    const webClient = this.createWebClient(accessToken);
    const response = await webClient.users.list({
      limit: 1000,
    });
    return response;
  }

  async getUser(accessToken: string, userId: string) {
    const webClient = this.createWebClient(accessToken);
    const response = await webClient.users.info({ user: userId });
    return response;
  }

  async getConversationInfo(accessToken: string, channelId: string) {
    const webClient = this.createWebClient(accessToken);
    const response = await webClient.conversations.info({ channel: channelId });
    return response;
  }
}
