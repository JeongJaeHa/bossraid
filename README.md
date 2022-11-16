# 개요
요구사항에 맞는 게임 API 구현 프로젝트입니다.

# 기술스택
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/></a> <img src="https://img.shields.io/badge/NestJs-E0234E?style=flat-square&logo=NestJs&logoColor=white"/></a>  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white"/></a> <img src="https://img.shields.io/badge/Mysql-4479A1?style=flat-square&logo=MySql&logoColor=white"/></a>  <img src="https://img.shields.io/badge/TypeOrm-262627?style=flat-square&logo=typeorm&logoColor=white"/></a>

  # ERD
  <img width="490" alt="스크린샷 2022-11-16 오후 1 50 36" src="https://user-images.githubusercontent.com/99805929/202086674-539af2de-1776-413c-8d48-e008fcaf57a4.png">

  # 구현사항
  ## 유저생성

  닉네임을 입력 시 사용자를 생성하고 userId를 반환합니다.

<img width="1041" alt="스크린샷 2022-11-16 오후 1 28 21" src="https://user-images.githubusercontent.com/99805929/202083744-16a99746-eb98-4e3a-b839-8d19404de8ec.png"><br/>

  ## 유저조회
  사용자 id(userId)의 총 점수와 레이드 기록(입장시간 기준 최신순)을 전송합니다

<img width="1034" alt="스크린샷 2022-11-16 오후 1 30 08" src="https://user-images.githubusercontent.com/99805929/202083974-66c0a1a3-c196-48c3-b7e3-e32cf145bdbe.png"><br/>

  ## 레이드 상태확인
DB에서 end_time이 Null인 값을 조회하여 없는 경우 true(입장가능)을 있는 경우 해당 row의 userId와 false(입장불가능)을 return 합니다.

<img width="1039" alt="스크린샷 2022-11-16 오후 1 32 23" src="https://user-images.githubusercontent.com/99805929/202084261-76220a52-c530-4d7b-a994-7d5118c6ffd9.png"><br/>

  ## 레이드 입장
사용자 id(userId)와 level을 입력하면 recordId를 반환합니다.<br/>
Redis 메모리에 level 값이 없는 경우 Http Request를 전송하여 값을 받아오고, Response에 level 값이 없는 경우에는 에러를 발생시킵니다.

<img width="1040" alt="스크린샷 2022-11-16 오후 1 35 04" src="https://user-images.githubusercontent.com/99805929/202084608-2962b88c-6c3e-4a12-9b08-8a54c01cb4c8.png"><br/>

  ## 레이드 종료
  userId와 recordId를 입력하여 전송 시 레이드가 종료됩니다.<br/>
  Score는 Redis 메모리에 저장되어 있는 Score를 활용하며 최종 점수를 합산하여 Redis 메모리에 저장합니다.

<img width="1041" alt="스크린샷 2022-11-16 오후 1 37 27" src="https://user-images.githubusercontent.com/99805929/202084888-e8e7090a-80b6-4358-a793-654f05ae9444.png"><br/>


  ## 레이드 랭킹조회
  Redis 메모리에 저장된 유저의 랭킹정보를 가져옵니다.

  <img width="1038" alt="스크린샷 2022-11-16 오후 1 40 57" src="https://user-images.githubusercontent.com/99805929/202085405-2dde8a2e-4896-4618-9836-fef5c4d84b2e.png">
  <br/>
 