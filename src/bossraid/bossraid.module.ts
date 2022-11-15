import { CacheModule, Module } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { BossraidController } from './bossraid.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidHistories } from './entities/bossraid.entity';
import * as redisStore from 'cache-manager-ioredis'
import { Users } from 'src/users/entities/user.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([RaidHistories]),TypeOrmModule.forFeature([Users]),
  CacheModule.register(
    {
      store: redisStore,
      host: 'localhost',
      port: 6378,
      ttl: 0
    }
  )
],
  controllers: [BossraidController],
  providers: [BossraidService]
})
export class BossraidModule {}
