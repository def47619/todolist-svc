const http = require('http');
const PORT = 8080;

 // 서버를 구동할 함수를 설정 
const server = http.createServer(async (req, res) => { // req : request / res : response
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); // 한글 깨짐 방지 위함 
    res.write("<h1>나 정도면 잘생김</h1>");
    res.write("<h2>나 정도면 잘생김</h2>");
    res.end(`<p>${req.url}</p>`);
}).listen(PORT);

server.on('listening', () => {
    console.log(`${PORT} 포트에서 서버가 시작되었습니다.`);
});