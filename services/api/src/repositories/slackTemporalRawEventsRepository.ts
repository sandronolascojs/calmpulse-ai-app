import { slackTemporalRawEvents } from '@calmpulse-app/db/schema';
import { BaseRepository } from '@calmpulse-app/shared';
import {
  AppMentionEvent,
  MemberJoinedChannelEvent,
  MessageEvent,
  SlackEventTypes,
  TeamJoinEvent,
  type DndUpdatedUserEvent,
} from '@calmpulse-app/types';

export class SlackTemporalRawEventsRepository extends BaseRepository {
  async saveSlackTemporalRawEvent({
    eventId,
    eventPayload,
    workspaceMemberId,
    eventType,
  }: {
    eventId: string;
    eventPayload:
      | MessageEvent
      | MemberJoinedChannelEvent
      | AppMentionEvent
      | TeamJoinEvent
      | DndUpdatedUserEvent;
    workspaceMemberId: string;
    eventType:
      | SlackEventTypes.MEMBER_JOINED_CHANNEL
      | SlackEventTypes.TEAM_JOIN
      | SlackEventTypes.APP_MENTION
      | SlackEventTypes.MESSAGE
      | SlackEventTypes.DND_UPDATED_USER;
  }) {
    await this.db.insert(slackTemporalRawEvents).values({
      slackEventId: eventId,
      timestamp: new Date(),
      payload: eventPayload,
      workspaceMemberId,
      type: eventType,
    });
  }
}
