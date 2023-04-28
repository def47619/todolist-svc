const express = require('express');
const router = express.Router();
const todolistDao = require('./dao/todolistDao'); // 파일 db 접근하려면 require 코드 필요

// 메인 페이지 접근 
router.get('/', (req, res) => {
    console.log('### Get /');
    res.render("index", {
        title: "todolist 서비스 v1.0",
        subtitle: "(node.js + express + lokijs)",
    });
});

// 특정 사용자의 모든 내용 출력 / 데이터 얻기
router.get('/todolist/:owner', (req, res) => {
    const owner = req.params.owner; // 데이터 조회
    let result = todolistDao.getTodoList({owner}); // json 형태의 데이터 반환
    res.json(result);    
});

// post : body로 전달됨 + 데이터 추가
// json이 전달되려면 javascript 객체로 전달되어야 한다.
router.post('/todolist/:owner', (req, res) => {
    let {todo, desc} = req.body;
    const owner = req.params.owner;
    const result = todolistDao.addTodo({owner, todo, desc}); // post : 데이터 db에 추가
    res.json(result); // 추가한 데이터를 사용자에게도 출력

    // 우리가 브라우저 url로 post 요청을 할 수 없다.
    // postman 프로그램으로 post 요청을 수행해야 한다.
})

module.exports = router;