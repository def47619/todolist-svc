const express = require('express');
const app = express();

const logger = (req, res, next) => {
    console.log(`### ${req.method}, ${req.url}`);
    next();
};

app.use(logger); // 순서가 중요하다. 맨 처음에 넣고, 해당 로거 함수 내에 next 있어야 다음 함수로 넘어간다. 
// next를 하면, 밑의 함수 코드로 넘어가는 것을 허용하는 것이라 봐도 된다. 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // 해당 응답 결과로 index.html을 보내는 함수
});

app.get('/ko', (req, res) => {
    // 헤더 없어도 됨, 헤더 안 쓰려고 json 메서드 쓰는 것임 
    // res.writeHead(200, { 'Content-Type': 'application/json' }); // 한글 깨짐 방지 위함 
    res.json({requrl: req.url, msg:'안녕'});
});

app.listen(8080, () => {
    console.log(`### 8080 포트의 서버가 구동되었습니다.`);
});