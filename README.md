# todolist-svc

### npm packages
- `npm install --save express`
- `npm install -D nodemon `
    - 변경된 사항 모니터링 -> 테스트 중인 서버에 바로 적용 
- `npm install cookie-parser`
- `npm install --save dotenv`
    - 환경변수 설정 : .env 파일에 적절한 키:값 쌍을 설정함
- ``npm install --save bson-objectid cors ejs express lokijs morgan rotating-file-stream``
    - bson-objectid : mongodb에서 key field 로 사용하는 값의 형식
        - 중복된 값이 없어지지 않는다. 
    - cors : cross-domain 문제를 해결하는 middleware
    - ejs : 동적인 웹 페이지를 만들어내는 middleware
    - lokijs : 파일 시스템으로 사용하는 로컬 파일 - 파일 DB 사용을 위함
    - morgan : 사용자가 지정한 위치에 로그 파일을 생성/해당 파일에 로그를 저장하는 모듈
        - console에서 로그를 출력하게 할 수도 있다. 
    - rotating-file-system : 하나의 로그 파일에 계속 로그 파일 저장하면 크기 커짐 
        - 로그마다/날짜-시간-분 단위로 하나의 로그 파일을 생성할 수 있도록 하는 모듈
        - 텍스트 크기마다로 설정할 수 있음 
        - https://www.npmjs.com/package/rotating-file-stream


## API sites
- https://contactsvc.bmaster.kro.kr/contacts?pageno=1$pagesize=4
- https://contactsvc.bmaster.kro.kr/contacts


## 테스트/개발 프로그램 
- postman : 네트워크 테스트 
- mongodb : NOSQL DB
    - 윈도우 버전 6.0.5 설치
        - C:\mongodb 디렉토리 생성하여 그 안에 설치하기
    - mongoshell 1.8.0 버전 설치
        - C:\mongodb 디렉토리 밑에 압축 해제해서 붙여넣기
- mongodb atlas : mongodb의 클라우드 서버


## server.js
- server_old.js / server.js / router.js 분리
    - middleware 등록하는 부분은 따로, router 부분 따로, 처리하는 부분 따로 만들어
    - 하나의 서버 파일의 크기를 크게 만들지 않도록 하기 위함