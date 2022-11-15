import { Module } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { BossraidController } from './bossraid.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidHistories } from './entities/bossraid.entity';
import { Users } from 'src/users/entities/user.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([RaidHistories]),TypeOrmModule.forFeature([Users])
],
  controllers: [BossraidController],
  providers: [BossraidService]
})
export class BossraidModule {}
