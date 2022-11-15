import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, matches, Matches } from 'class-validator';
import { CreateBossraidDto } from './create-bossraid.dto';

export class UpdateBossraidDto {
    @IsNumber()
    @Matches(/[0-9]/, {
        message: 'userId(숫자)를 입력해주세요.'
    })
    userId: string;

    @IsNumber()
    @Matches(/[0-9]/, {
        message: 'recordId(숫자)를 입력해주세요.'
    })
    recordId: string;
}
