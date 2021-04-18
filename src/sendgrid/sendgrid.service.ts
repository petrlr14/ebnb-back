import { Inject, Injectable } from '@nestjs/common';
import { MailDataRequired, MailService } from '@sendgrid/mail';
import { SENDGRID_MAIL } from './sendgrid.constants';

@Injectable()
export class SendgridService {
  constructor(@Inject(SENDGRID_MAIL) private mailService: MailService) {}

  async send(data: MailDataRequired) {
    try {
      return await this.mailService.send(data, false);
    } catch (e) {
      console.log(e);
    }
  }
}
