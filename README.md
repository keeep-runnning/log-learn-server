# log simple server

쉽고 간단한 블로그 서비스입니다.

## 개발 일지

개발하면서 **공부한 내용**, **겪었던 문제를 해결하기 위해 노력했던 과정**을 [Github Wiki](https://github.com/keeep-runnning/log-simple-server/wiki)에 정리했습니다.

## 기술 스택

<div>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4479A1?style=for-the-badge&logo=PostgreSQL&logoColor=white" />
  <img src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
</div>
<div>
  <img src="https://img.shields.io/badge/Node.js-v18-339933?style=for-the-badge&logo=node.js" />
</div>

## 주요 기능

### 계정 관련 기능

- 회원가입, 로그인, 로그아웃
- 계정 설정
  - 유저이름 변경
  - 짧은 소개 변경
  - 소개 변경
  - 비밀번호 변경

### 블로그 포스트 관련 기능

- 블로그 포스트 생성/수정/삭제
- 블로그 포스트 목록 조회
- 블로그 포스트 상세 조회

## 로컬 환경에서 실행하는 방법

postgresql 대신, 간단하게 **sqlite를 사용하는 방법**입니다.

1. `.env.sample` 파일을 복사해 `.env` 파일을 생성합니다. (또는 `.env.sample` 파일의 이름을 `.env`로 변경합니다)

2. `prisma/schema.prisma` 파일의 `datasource db`에 `sqlite`를 사용하도록 설정합니다.

   - `postgresql` 관련 설정을 주석 처리하고, `sqlite` 관련 설정을 사용합니다.

     ```text
     // datasource db {
     //   provider = "postgresql"
     //   url      = env("DATABASE_URL")
     // }

     datasource db {
       provider = "sqlite"
       url      = "file:./dev.db"
     }
     ```

3. `prisma/migrations` 폴더를 제거합니다.
4. `npm install` 명령어로 필요한 패키지들을 설치합니다.
5. `npx prisma db push` 명령어로 sqlite와 동기화합니다.
6. `npx prisma generate` 명령어로 Prisma Client를 생성합니다.
7. `npm run dev` 명령어로 서버를 실행시킵니다.

   - `8080` 포트에서 실행됩니다.
   - `.env` 파일에 포트를 설정할 수 있습니다.
