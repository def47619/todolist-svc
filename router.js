const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('### Get /');
    res.render("index", {
        title: "todolist 서비스 v1.0",
        subtitle: "(node.js + express + lokijs)",
    });
});

module.exports = router;