import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body(ValidationPipe) createUserDto: CreateUserDto):Promise<{"userId": number}> {
    return this.usersService.create(createUserDto);
  }

  @Get(':userId')
  @HttpCode(200)
  findOne(@Param('userId') userId: number) {
    return this.usersService.findOne(userId);
  }
}
