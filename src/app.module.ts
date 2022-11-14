import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { config } from 'dotenv';
import { Users } from './users/entities/user.entity';

config();

const port = Number(process.env.TYPEORM_PORT)

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(
      {
        type: 'mysql',
        host: process.env.TYPEORM_HOST,
        port: port,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD, 
        database: process.env.TYPEORM_DATABASE,
        entities: [Users],
        logging: false,
        synchronize: false,
      }
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
