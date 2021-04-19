import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { SENDGRID_MAIL } from './sendgrid.constants';

export const sendGridProvider = [
  {
    provide: SENDGRID_MAIL,
    useFactory: (config: ConfigService): MailService => {
      const mail = new MailService();
      mail.setApiKey(config.get<string>('SENDGRID_API_KEY'));
      return mail;
    },
    inject: [ConfigService],
  },
];
