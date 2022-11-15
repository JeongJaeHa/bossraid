import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, CACHE_MANAGER, BadRequestException, CacheTTL, UseInterceptors, CacheInterceptor, ValidationPipe } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { CreateBossraidDto } from './dto/create-bossraid.dto';
import { UpdateBossraidDto } from './dto/update-bossraid.dto';
import { HttpService } from '@nestjs/axios'
import { firstValueFrom, map, Observable } from 'rxjs';
import Redis from 'ioredis'
import { InjectRedis } from '@liaoliaots/nestjs-redis'

@Controller('bossraid')
export class BossraidController {
  constructor(private readonly bossraidService: BossraidService,
    @InjectRedis() private readonly redis: Redis,
    private readonly httpService: HttpService,
    ) {}
    
  @Post('/enter')
  async raidEnter(@Body(ValidationPipe) createBossraidDto: CreateBossraidDto): Promise<{}> {
    const { level } = createBossraidDto
    await firstValueFrom(this.httpService.get('https://dmpilf5svl7rv.cloudfront.net/assignment/backend/bossRaidData.json').pipe(
      map((res) => {
        try{
          let reqLevel = res.data.bossRaids[0].levels[level].level
          let reqScore = res.data.bossRaids[0].levels[level].score
          this.redis.set('score', reqScore)
          this.redis.set('level', reqLevel)
        } catch (err) {
          throw new BadRequestException('level을 확인해주세요')
        }
      })
    ));
    return this.bossraidService.raidEnter(createBossraidDto);
  }

  @Get()
  checkEnter() {
    return this.bossraidService.checkEnter();
  }

  @Patch('/end')
  async raidEnd(@Body(ValidationPipe) updateBossraidDto: UpdateBossraidDto):Promise<{}> {
    const redisScore = await this.redis.get('score');
    const { userId, recordId } = updateBossraidDto
    return await this.bossraidService.raidEnd(userId, recordId, redisScore);
    
  }
}
