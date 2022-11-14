import { Module } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { BossraidController } from './bossraid.controller';

@Module({
  controllers: [BossraidController],
  providers: [BossraidService]
})
export class BossraidModule {}
