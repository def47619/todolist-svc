// middleware 중심으로 등록
const express = require('express');
const path = require('path');
const router = require('./router');

const startServer = async () => {
    const BASEDIR = process.env.BASEDIR || path.resolve('.');
    const PORT = process.env.PORT || 8080;

    const logger = (req, res, next) => {
        console.log(`${req.method}, ${req.url}`);
        next();
    };
    const app = express();

    app.use(logger);
    app.use(express.static(BASEDIR + '/public'));
    app.set('views', BASEDIR + '/views'); // views라는 폴더를 viewpage로 생성
    app.set('view engine', 'ejs'); // 페이지 엔진은 ejs를 쓸 것이다.
    app.engine('html', require('ejs').renderFile); // html이 아닌 것들은 ejs -> html로 render하는 모듈로 변환하여 보여주겠다.

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use(router);

    app.listen(PORT, () => {
        console.log(`### ${PORT}번 포트에서 서버가 시작되었습니다.`);
    });
};

startServer();