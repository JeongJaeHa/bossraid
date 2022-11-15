import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Repository } from 'typeorm';
import { CreateBossraidDto } from './dto/create-bossraid.dto';
import { RaidHistories } from './entities/bossraid.entity';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Users, UsersRepository } from 'src/users/entities/user.entity';

const moment = require('moment-timezone')
moment.tz.setDefault("Asia/Seoul")
const LimitTime = Number(process.env.LIMIT_TIME)

@Injectable()
export class BossraidService {
  constructor(
    @InjectRepository(RaidHistories)
    private readonly raidHistoriesRepository: Repository<RaidHistories>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<UsersRepository>,
    private readonly connection: Connection,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async raidEnter(createBossraidDto: CreateBossraidDto): Promise<{}> {
    const { userId, level } = createBossraidDto;
    const findUser = await this.usersRepository
    .query(
      `
        SELECT id FROM users WHERE id = ${userId}
      `
    )
    if(findUser.length == 0) {
      throw new BadRequestException('user not exits')
    }
    const findPlay = await this.raidHistoriesRepository.findOne({where: {end_time: IsNull()}})
    if(findPlay){
      throw new BadRequestException('another user play now');
    }

    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const raid = new RaidHistories
      raid.userId = userId;
      raid.level = level;
      raid.enter_time = new Date()
      await queryRunner.manager.save(raid);
      await queryRunner.commitTransaction();
    } catch(err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    const enterUser = await this.raidHistoriesRepository
    .query(
      `
      SELECT id AS recordId, userId AS userId
      FROM userhistories
      WHERE end_time IS NULL
      `
    )
    const recordId = enterUser[0].recordId
    return Object.assign({"raidRecordId": recordId, "isEnter": ""})
  }

  async checkEnter() {
    const find = await this.raidHistoriesRepository
    .query(`
    SELECT
    id,
    userId, 
    enter_time,
    end_time
    FROM userhistories 
    WHERE end_time Is Null
    `)
    if(find.length == 0){
      return Object.assign({"canEnter": "true"})
    }
    const id = find[0].id
    const userId = find[0].userId;
    const enterTime = find[0].enter_time;
    if(Date.now()/1000 > Math.floor(enterTime/1000 + LimitTime)){
      const endUpdate = await this.raidHistoriesRepository.findOneBy({id: id});
      endUpdate.end_time = new Date();
      endUpdate.score = 0;
      await this.raidHistoriesRepository.save(endUpdate);
      return Object.assign({"canEnter": "true"})
    } else if(find){
      return Object.assign({"canEnter": "false", "enterUserId": userId})
    }
  }

  async raidEnd(userId: number, recordId: number, redisScore: any) {
    const record = await this.raidHistoriesRepository
    .query(`
    SELECT
    *,
    (select sum(score) from userhistories GROUP BY userId HAVING userId = ${userId}) AS total
    FROM userhistories 
    WHERE id =${recordId} AND userID = ${userId} AND end_time IS NULL
    `)
    if(record.length == 0) {
      throw new BadRequestException('this raid already end')
    }
    const enterTime = record[0].enter_time;
    const time = new Date()
    const clearTime = (Date.now()/1000 - enterTime/1000)
    const beforeTotalScore = Number(record[0].total)
    const newTotalScore = (beforeTotalScore + Number(redisScore))
    
      if(Date.now()/1000 < Math.floor(enterTime/1000 + LimitTime)) {
            await this.raidHistoriesRepository
            .createQueryBuilder()
            .update('userhistories')
            .set({score: redisScore, end_time: time})
            .where({id: recordId})
            .execute()
            await this.redis.zadd(`rank`, newTotalScore, `${userId}`)
        }
      else {
        let score = 0
        await this.raidHistoriesRepository
        .createQueryBuilder()
        .update('userhistories')
        .set({score: score, end_time: time})
        .where({id: recordId})
        .execute()
      }
      const result = String(Math.floor(clearTime))   
      return Object.assign({'clearTime': result + 's'})
}
}
