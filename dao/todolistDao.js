const loki = require('lokijs');
const fs = require('fs');
const path = require('path');

const objectid = require("bson-objectid"); // 고유 key를 생성할 때 쓰인다. 
const baseDir = path.resolve('.'); // 현재 디렉토리를 base directory로 생성한다.
const DBFILE = 'todolist.db'; // db파일 이름
const DBFILE_DIR = path.join(baseDir, '/' + DBFILE); // db파일 저장하는 경로 : 파일명 포함

// 아래의 코드는 실제로 쓸 일이 없는 코드 : 파일 db를 사용하기 때문에 , 실제 DB를 연동하여 사용해야 함 

let db = new loki(DBFILE_DIR, {
  autosave: true, // 주기적으로 자동 저장 속성 선언
  autosaveInterval: 2000 // 메모리에 db 수정 사항 생성되다가 2초에 한 번씩 파일에 갱신되어 저장됨
})

let todolist;
if (fs.existsSync(DBFILE_DIR)) { // 해당 경로에 db 파일 있으면 : load
  db.loadDatabase({}, (err)=>{
    if (err) {
      console.log("error : " + err);
    }
    else {
      console.log("### 기존 DB 파일 로드!");
      todolist = db.getCollection("todolist");
    }
  });
} else { // 해당 경로에 db 파일 없으면 : 새로 생성
  console.log("## 새로운 DB 파일 생성")
  todolist = db.getCollection("todolist");
  if (todolist === null) { // 새롭게 db 파일 생성되면 queryResult가 없을 것 -> 데이터 생성
    todolist = db.addCollection("todolist", { indices: ["owner", "id"] });
    todolist.insert({ owner: "gdhong", id: objectid().toHexString(), todo: "ES6 공부", desc: "ES6공부를 해야 합니다", completed: true });
    todolist.insert({ owner: "gdhong", id: objectid().toHexString(), todo: "Vue 학습", desc: "Vue 학습을 해야 합니다", completed: false });
    todolist.insert({ owner: "gdhong", id: objectid().toHexString(), todo: "놀기", desc: "노는 것도 중요합니다.", completed: true });
    todolist.insert({ owner: "gdhong", id: objectid().toHexString(), todo: "야구장", desc: "프로야구 경기도 봐야합니다.", completed: false });
  }
}

exports.createNewOwner = ({ owner }) => {
  try {
    let queryResult = todolist.find({ owner }); // owner를 알아내서 없으면 추가
    if (queryResult.length === 0) { 
      todolist.insert({ owner, id: objectid().toHexString(), todo: "ES6 공부", desc: "ES6공부를 해야 합니다", completed: true });
      todolist.insert({ owner, id: objectid().toHexString(), todo: "Vue 학습", desc: "React 학습을 해야 합니다", completed: false });
      todolist.insert({ owner, id: objectid().toHexString(), todo: "야구장", desc: "프로야구 경기도 봐야합니다.", completed: false });
      return { status: "success", message: "샘플 데이터 생성 성공!" };
    } else {
      return { status: "fail", message: "생성 실패 : 이미 존재하는 owner입니다." };
    }
  } catch (ex) {
    return { status: "fail", message: "생성 실패 : " + ex };
  }
};

exports.getTodoList = ({ owner }) => {
  try {
    let result = [];
    let queryResult = todolist.chain().find({ owner }).simplesort("id", true).data();

    for (var i = 0; i < queryResult.length; i++) {
      let item = { ...queryResult[i] };
      delete item.meta; // mongodb를 다루다 보면 쓸데없는 항목들이 생기는데, 이를 제거하기 위한 코드 
      delete item["$loki"];
      delete item.owner;
      result.push(item);
    }
    return result;
  } catch (ex) {
    return { status: "fail", message: "조회 실패 : " + ex };
  }
};

exports.getTodoItem = ({ owner, id }) => { // 데이터 1건 조회
  try {
    let one = todolist.findOne({ owner, id });
    let item = { ...one };
    delete item.meta;
    delete item["$loki"];
    delete item.owner;
    return item;
  } catch (ex) {
    return { status: "fail", message: "조회 실패 : " + ex };
  }
};

exports.addTodo = ({ owner, todo, desc }) => { // 데이터 추가
  try {
    if (todo === null || todo.trim() === "") {
      throw new Error("할일을 입력하셔야 합니다.");
    }
    let item = { owner: owner, id: objectid().toHexString(), todo: todo, desc: desc, completed: false };
    todolist.insert(item);
    return { status: "success", message: "추가 성공", item: { id: item.id, todo: item.todo, desc: item.desc } };
  } catch (ex) {
    return { status: "fail", message: "추가 실패 : " + ex };
  }
};

exports.deleteTodo = ({ owner, id }) => {
  try {
    let one = todolist.findOne({ owner, id });
    if (one !== null) {
      todolist.remove(one);
      return { status: "success", message: "삭제 성공", item: { id: one.id, todo: one.todo } };
    } else {
      return { status: "fail", message: "삭제 실패 : 삭제하려는 데이터가 존재하지 않음" };
    }
  } catch (ex) {
    return { status: "fail", message: "삭제 실패 : " + ex };
  }
};

exports.updateTodo = ({ owner, id, todo, desc, completed }) => {
  try {
    let one = todolist.findOne({ owner, id });
    if (one !== null) {
      one.completed = completed;
      one.todo = todo;
      one.desc = desc;
      todolist.update(one);
      return { status: "success", message: "할일 변경 성공", item: { id: one.id, todo: one.todo, desc: one.desc, completed: one.completed } };
    } else {
      return { status: "fail", message: "할일 변경 실패 : 변경하려는 데이터가 존재하지 않음" };
    }
  } catch (ex) {
    return { status: "fail", message: "할일 변경 실패 : " + ex };
  }
};

exports.toggleCompleted = ({ owner, id }) => {
  try {
    let one = todolist.findOne({ owner, id });
    if (one !== null) {
      one.completed = !one.completed;
      todolist.update(one);
      return { status: "success", message: "완료 변경 성공", item: { id: one.id, todo: one.todo, completed: one.completed } };
    } else {
      return { status: "fail", message: "완료 변경 실패 : 변경하려는 데이터가 존재하지 않음" };
    }
  } catch (ex) {
    return { status: "fail", message: "완료 변경 실패 : " + ex };
  }
};