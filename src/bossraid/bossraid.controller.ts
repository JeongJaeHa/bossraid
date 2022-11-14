import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BossraidService } from './bossraid.service';
import { CreateBossraidDto } from './dto/create-bossraid.dto';
import { UpdateBossraidDto } from './dto/update-bossraid.dto';

@Controller('bossraid')
export class BossraidController {
  constructor(private readonly bossraidService: BossraidService) {}

  @Post()
  create(@Body() createBossraidDto: CreateBossraidDto) {
    return this.bossraidService.create(createBossraidDto);
  }

  @Get()
  findAll() {
    return this.bossraidService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bossraidService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBossraidDto: UpdateBossraidDto) {
    return this.bossraidService.update(+id, updateBossraidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bossraidService.remove(+id);
  }
}
