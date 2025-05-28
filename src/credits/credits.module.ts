import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { CreditsRepository } from './credits.repository';

@Module({
  providers: [CreditsService, CreditsRepository],
  controllers: [CreditsController]
})
export class CreditsModule {}
