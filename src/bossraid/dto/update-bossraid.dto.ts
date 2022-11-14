import { PartialType } from '@nestjs/mapped-types';
import { CreateBossraidDto } from './create-bossraid.dto';

export class UpdateBossraidDto extends PartialType(CreateBossraidDto) {}
