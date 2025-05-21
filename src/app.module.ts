import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreditsModule } from './credits/credits.module';

@Module({
  imports: [CreditsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
