import { Module } from '@nestjs/common';
import { sendGridProvider } from './sendgrid.provider';
import { SendgridService } from './sendgrid.service';

@Module({
  providers: [...sendGridProvider, SendgridService],
  exports: [...sendGridProvider, SendgridService],
})
export class SendgridModule {}
