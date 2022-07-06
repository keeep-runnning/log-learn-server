# log learn server
> 공부한 내용을 정리할 수 있는 블로그 서비스입니다.


## 기술 스택
<div>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" />
</div>
<div>
  <img src="https://img.shields.io/badge/express-000000?style=flat&logo=express&logoColor=white" />
</div>
<div>
  <img src="https://img.shields.io/badge/mysql-4479A1?style=flat&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white" />
</div>


## 주요 기능

### 🧑‍💻 계정 관리 기능
- 계정 만들기(회원 가입)
- 로그인, 로그아웃
- 계정 설정
  - 유저 이름 변경
  - 비밀번호 변경
  - 짧은 소개 및 소개 변경

### 📄 블로그 포스트 관리 기능
- 블로그 포스트 생성/수정/삭제
- 블로그 포스트 목록 조회
- 블로그 포스트 상세 조회


## 실행 방법

### local에서 실행하기
1. dependency 설치
    ```bash
    npm install  
    ```
2. `.env` 파일을 `root` 폴더에 작성해, 필요한 환경 변수 설정하기
    - 템플릿
      ```
      DB_USERNAME="{데이터베이스 유저명}"
      DB_PASSWORD="{데이터베이스 비밀번호}"
      DB_DATABASE="{데이터베이스 이름}"

      COOKIE_SECRET="{signed cookie를 사용하기 위한 cookie secret}"
      ```
   > 📌 `.env` 파일 작성 전에... <br>
   `mysql`이 `local`에 설치되어 있어야 합니다. <br>
   데이터베이스 관련 설정(유저 생성, 데이터베이스 생성)이 되어 있어야 합니다.
3. 실행
    ```bash
    npm run dev
    ```
