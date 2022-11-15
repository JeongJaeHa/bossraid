import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, CACHE_MANAGER, BadRequestException, CacheTTL, UseInterceptors, CacheInterceptor, ValidationPipe } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { CreateBossraidDto } from './dto/create-bossraid.dto';
import { UpdateBossraidDto } from './dto/update-bossraid.dto';
import { HttpService } from '@nestjs/axios'
import { firstValueFrom, map, Observable } from 'rxjs';
import Redis from 'ioredis'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { BossraidRankDto } from './dto/get-bossraidRank.dto';

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
  @Get('/topLankerList')
  async rank(
    @Body(ValidationPipe) userInfo: BossraidRankDto
  ) {
    try{
      const array = [];
      const rank = await this.redis.zrange('rank', 0, 5, 'WITHSCORES');
      for(let i = rank.length / 2; i > 0; i--) {
        const rankInfo = {
          'ranking': rank.length / 2 - i,
          'userId': rank[2*i - 2],
          'totalScore': rank[(2*i - 1)]
        }
        array.push(rankInfo)
      }
      const myId = Object.values(userInfo)[0]
      const myRank = await this.redis.zrank('rank', myId)
      return Object.assign({'topRankerInfoList': array, 'myRankingInfo': myRank})
    } catch(err){
      console.log(err)
    }
  }
}
