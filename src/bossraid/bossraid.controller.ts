import { Controller, Get, Post, Body, Patch,  BadRequestException, ValidationPipe } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { CreateBossraidDto } from './dto/create-bossraid.dto';
import { UpdateBossraidDto } from './dto/update-bossraid.dto';
import { HttpService } from '@nestjs/axios'
import { firstValueFrom, map } from 'rxjs';
import Redis from 'ioredis'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { BossraidRankDto } from './dto/get-bossraidRank.dto';
import { config } from 'dotenv'

config();

@Controller('bossraid')
export class BossraidController {
  constructor(private readonly bossraidService: BossraidService,
    @InjectRedis() private readonly redis: Redis,
    private readonly httpService: HttpService,
    ) {}
    
  @Post('/enter')
  async raidEnter(@Body(ValidationPipe) createBossraidDto: CreateBossraidDto) {
    const { level, userId } = createBossraidDto
    const maxLevel = Number(process.env.MAX_LEVEL)
    const getRedisLevel = await this.redis.get(`level${level}`)
    await this.redis.set(`user${userId}EnterLevel`, level)
    if(!getRedisLevel && level <= maxLevel) {
      await firstValueFrom(this.httpService.get('https://dmpilf5svl7rv.cloudfront.net/assignment/backend/bossRaidData.json').pipe(
        map((res) => {
          for(let i=0; i<res.data.bossRaids[0].levels.length; i++) {
            let reqLevel = res.data.bossRaids[0].levels[i].level
            let reqScore = res.data.bossRaids[0].levels[i].score
            this.redis.set(`level${i} score`, reqScore)
            this.redis.set(`level${i}`, reqLevel)
          }
        })
      ));
    } else if (!getRedisLevel){
      throw new BadRequestException('check enter level')
    }
    return this.bossraidService.raidEnter(createBossraidDto, Number(getRedisLevel));
  }

  @Get()
  checkEnter() {
    return this.bossraidService.checkEnter();
  }

  @Patch('/end')
  async raidEnd(@Body(ValidationPipe) updateBossraidDto: UpdateBossraidDto):Promise<{}> {
    const { userId, recordId } = updateBossraidDto
    const redisLevel = await this.redis.get(`user${userId}EnterLevel`);
    if(!redisLevel) {
      await this.bossraidService.updateEndTime(userId, recordId)
      throw new BadRequestException('this raid already end')
    }
    const redisScore = await this.redis.get(`level${redisLevel} score`);
    await this.redis.del(`user${userId}EnterLevel`);
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
