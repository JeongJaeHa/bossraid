import { IsNumber, IsString } from 'class-validator';

export class BossraidRankDto {
    @IsNumber()
    userId: number;
}
