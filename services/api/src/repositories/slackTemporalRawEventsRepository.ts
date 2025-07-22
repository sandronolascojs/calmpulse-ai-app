import { slackTemporalRawEvents } from '@calmpulse-app/db/schema';
import { BaseRepository } from '@calmpulse-app/shared';
import {
  AppMentionEvent,
  MemberJoinedChannelEvent,
  MessageEvent,
  SlackEventTypes,
  TeamJoinEvent,
} from '@calmpulse-app/types';

export class SlackTemporalRawEventsRepository extends BaseRepository {
  async saveSlackTemporalRawEvent({
    eventId,
    eventPayload,
    workspaceMemberId,
    eventType,
  }: {
    eventId: string;
    eventPayload: MessageEvent | MemberJoinedChannelEvent | AppMentionEvent | TeamJoinEvent;
    workspaceMemberId: string;
    eventType: SlackEventTypes;
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
