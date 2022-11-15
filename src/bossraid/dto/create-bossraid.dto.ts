import { IsNumber, Matches } from "class-validator";

export class CreateBossraidDto {
    @IsNumber()
    @Matches(/[0-9]/, {
        message: 'userId(숫자)를 입력해주세요.'
    })
    userId: number;

    @IsNumber()
    @Matches(/[0-9]/, {
        message: 'level(숫자)를 입력해주세요.'
    })
    level: number;
}
