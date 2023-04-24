const express = require('express');
const app = express();

app.get('/', (req, res) => {
    // 헤더 없어도 됨, 헤더 안 쓰려고 json 메서드 쓰는 것임 
    // res.writeHead(200, { 'Content-Type': 'application/json' }); 
    res.json({requrl: req.url, msg:'hello world'});
});

app.get('/ko', (req, res) => {
    // res.writeHead(200, { 'Content-Type': 'application/json' }); // 한글 깨짐 방지 위함 
    res.json({requrl: req.url, msg:'안녕'});
});

app.listen(8080, () => {
    console.log(`### 8080 포트의 서버가 구동되었습니다.`);
});