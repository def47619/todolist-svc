// middleware 중심으로 등록
const express = require('express');
const path = require('path');
const router = require('./router');
const cors = require('cors'); // cross-domain 문제를 해결하는 middleware
const fs = require('fs'); // 파일 저장 위한 middleware
const morgan = require('morgan'); // 로그 기록 위한 middleware
const rfs = require('rotating-file-stream'); // 로그 파일 분할 위한 middleware

const startServer = async () => {
    const BASEDIR = process.env.BASEDIR || path.resolve('.');
    const LOGDIR = process.env.LOGDIR || path.join(BASEDIR, '/log');
    // 환경 변수가 있으면 그것을 이용하고, 없으면 /log 디렉토리 사용하자.
    const PORT = process.env.PORT || 8080;

    const logger = (req, res, next) => {
        console.log(`${req.method}, ${req.url}`);
        next();
    };
    const app = express();
    app.use(cors());

    // 로깅
    fs.existsSync(LOGDIR) || fs.mkdirSync(LOGDIR);
    // 만약 LOGDIR이 있으면 그대로 쓰고, 아니면 mkdirSync 함수로 만들어라.
    const accessLogStream = rfs.createStream('access.log', {
        interval: '1d', // 매일 매일 로그 생성
        path: LOGDIR // 위치 설정
    });
    app.use(morgan('combined', {stream: accessLogStream}));

    app.use(express.static(BASEDIR + '/public')); // /intro.html 요청하면 public/intro.html 반환해줌
    app.set('views', BASEDIR + '/views'); // views라는 폴더를 viewpage로 생성
    app.set('view engine', 'ejs'); // 페이지 엔진은 ejs를 쓸 것이다.
    app.engine('html', require('ejs').renderFile); // html이 아닌 것들은 ejs -> html로 render하는 모듈로 변환하여 보여주겠다.

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    // 캐시를 저장하지 않는 middleware 작성
    app.use(function (req, res, next) {
        res.header(
            'Cache-Control',
            'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
    });

    app.use(router);

    app.listen(PORT, () => {
        console.log(`### ${PORT}번 포트에서 서버가 시작되었습니다.`);
    });
};

startServer();