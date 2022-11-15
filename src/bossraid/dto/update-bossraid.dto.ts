import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, matches, Matches } from 'class-validator';
import { CreateBossraidDto } from './create-bossraid.dto';

export class UpdateBossraidDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    recordId: number;
}
