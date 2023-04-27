const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const logger = (req, res, next) => {
    console.log(`### ${req.method}, ${req.url}`);
    next();
};

app.use(logger); // 순서가 중요하다. 맨 처음에 넣고, 해당 로거 함수 내에 next 있어야 다음 함수로 넘어간다. 
// next를 하면, 밑의 함수 코드로 넘어가는 것을 허용하는 것이라 봐도 된다. 

// content-type이 application/json이면 express.json()으로 payload가 파싱됨
app.use(express.json()); // 요청 정보를 파싱해주는 역할, json 형식의 요청 정보를 파싱함

// content-type이 application/x-www-form-urlencoded이면 urlencoded로 payload가 파싱됨
app.use(express.urlencoded({extended: true})); // 요청 정보를 파싱해주는 역할, urlencoded 형식의 요청 정보를 파싱함

app.use(express.static(__dirname + '/public')); 
// localhost:8080/intro.html 으로 요청해야 한다. 

// app.use(cookieParser('secretkey1111'));
app.use(cookieParser('secretkey1111')); // signedCookies를 사용하기 위해서는 생성자 안의 문자열이 필요한 것 같다. 
// 아마도 문자열이 sign을 위한 서명 문자열을 담당하는 것 같다.

app.get('/', (req, res) => {
    res.cookie('key1', 'value1', {httpOnly: true, maxAges: 60*60*1000, signed: true});
    res.send('<h1>쿠키 생성 완료</h1>');
})

app.get('/cookie', (req, res) => {
    // res.cookie('key1', 'value1', {httpOnly: true, maxAges: 60*60*1000, signed: true});
    // 위의 cookie를 따로 생성할 필요는 없는 것 같다. 아마도 /cookie를 탐색하면서 /를 지나오면서 cookie를 생성하여
    // /cookie에서는 루트 페이지의 쿠키를 그대로 사용하는 것 같다. 
    res.send(`<h1>쿠키 생성 완료 : ${req.signedCookies.key1}</h1><hr>`);
    res.send(req.signedCookies);
});

app.get('/ko', (req, res) => {
    // 헤더 없어도 됨, 헤더 안 쓰려고 json 메서드 쓰는 것임 
    // res.writeHead(200, { 'Content-Type': 'application/json' }); // 한글 깨짐 방지 위함 
    res.json({requrl: req.url, msg:'안녕'});
});

app.listen(8080, () => {
    console.log(`### 8080 포트의 서버가 구동되었습니다.`);
});