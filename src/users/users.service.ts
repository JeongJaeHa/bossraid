import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RaidHistories } from 'src/bossraid/entities/bossraid.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/user.entity';
const moment = require('moment-timezone')
moment.tz.setDefault("Asia/Seoul")

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(RaidHistories)
    private readonly raidHistoriesRepository: Repository<RaidHistories>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{"userId": number}> {
    const { nickname } = createUserDto;
    const user = await this.userRepository.findOneBy({nickname: nickname})
    if(user) {
      throw new BadRequestException('nickname duplicate');
    }
    try{
      await this.userRepository
      .createQueryBuilder()
      .insert()
      .into('users')
      .values({nickname: nickname, created_at: moment().format('YYYY-MM-DD HH:mm:ss')})
      .execute()
    } catch (err) {
      throw new InternalServerErrorException('server error')
    }
    const findUserId = await this.userRepository.findOneBy({nickname: nickname})
    const userId = findUserId.id
    return Object.assign({"userId": userId})
  }

  async findOne(userId: number) {
    try{
      let [score] = await this.raidHistoriesRepository
      .query(`SELECT sum(score) as score from userhistories where userId = ${userId} GROUP BY userId`)
    if(!score) score = 0

    const history = await this.raidHistoriesRepository
      .query(`select id as raidRecordId,
              score,
              enter_time as enterTime,
              end_time as endTime
              FROM userhistories
              WHERE userId = ${userId}`)
    return Object.assign({"totalScore": score, "bossRaidHistory": history})
    } catch(err) {
      throw new InternalServerErrorException('server error')
    }
  }
}
