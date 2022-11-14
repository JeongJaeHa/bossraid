import { Injectable } from '@nestjs/common';
import { CreateBossraidDto } from './dto/create-bossraid.dto';
import { UpdateBossraidDto } from './dto/update-bossraid.dto';

@Injectable()
export class BossraidService {
  create(createBossraidDto: CreateBossraidDto) {
    return 'This action adds a new bossraid';
  }

  findAll() {
    return `This action returns all bossraid`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bossraid`;
  }

  update(id: number, updateBossraidDto: UpdateBossraidDto) {
    return `This action updates a #${id} bossraid`;
  }

  remove(id: number) {
    return `This action removes a #${id} bossraid`;
  }
}
