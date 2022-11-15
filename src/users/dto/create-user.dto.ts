import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @MinLength(4, {
        message: '최소 4글자 이상 입력하세요'
    })
    @MaxLength(20, {
        message: '닉네임은 20글자 제한입니다.'
    })
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: '닉네임은 영어+숫자 조합만 가능합니다.'
    })
    nickname: string;
    
    created_at?: Date;
}

export class getUserDto {
    userId: number;
}
