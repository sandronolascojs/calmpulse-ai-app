import { Resend } from 'resend';

import { env } from '@/config/env.config';

export class EmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    await this.resend.emails.send({
      from: env.FROM_EMAIL,
      to,
      subject,
      html,
    });
  }
}
