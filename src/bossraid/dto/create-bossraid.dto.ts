import { IsNumber, Matches } from "class-validator";

export class CreateBossraidDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    level: number;
}
