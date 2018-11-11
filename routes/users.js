var express = require('express');
var router = express.Router();
//引入mysql模块
var connect = require("./common");
var utility = require("utility");
//解密
var crypto = require('crypto');


/* GET users listing. */
router.post("/add", function (req, res, next) {
  //接收数据
  let { username, pass, region } = req.body;
  // console.log(username, pass, region);
  //密码加密
  pass = utility.md5(pass);
  let sql = 'insert into usertable (userName,userPwd,userGroup) values (?,?,?)';
 let str=[username,pass,region]
  connect.query(sql, str,function (error, results, fields) {
    if (error) {
      res.send({ "ok": false, "msg": "添加失败！" });
    } else {
      res.send({ "ok": true, "msg": "添加成功！" });
    }

  });
  // res.send("123123");
});
//账号管理
router.get("/list", (req, res) => {
  let sql = "select * from usertable order by u_id desc";
  connect.query(sql, function (error, results, fields) {
    if (error) {

      res.send({ "ok": false, "msg": "查询失败！" });
    } else {
      var rst = JSON.stringify(results);
      //rst=JSON.parse(rst);
      res.send({ "ok": true, "msg": "查询成功！", "data": results });
      // res.send(results);
    }
  });
});
//账号删除
router.get('/del', (req, res) => {
  //获取传递的值
  let id = req.query.u_id;
  console.log(id);

  let sql = `delete from usertable where u_id=${id}`;
  connect.query(sql, (err, rst) => {
    if (err) {
      res.send({ "ok": false, "msg": "删除失败！" });
    } else {
      //rst=JSON.parse(rst);
      res.send({ "ok": true, "msg": "删除成功！" });
      // res.send(results);
    }
  });
});
//账号修改显示
router.get('/editList', (req, res) => {
  let id = req.query.id;
  let sql = `select * from usertable where u_id=${id}`;
  connect.query(sql, (err, rst) => {
    if (err) {
      res.send({ "ok": false, "msg": "查询失败！" });
    } else {
      //rst=JSON.parse(rst)
      
      res.send({ "ok": true, "msg": "查询成功！", "data": rst });
      // res.send(results);
    }
  });
});
//修改内容
router.post('/edit', (req, res) => {
  
  let {username,checkPass,region,u_id,oldPwd} = req.body;
  let newPass=checkPass;
  // console.log(id,pwd)
  // //加密
  if(oldPwd!=newPass)
  {
    checkPass = utility.md5(newPass);
  }
  //修改
  let sql = 'update usertable set userName=?,userPwd=?,userGroup=? where u_id=?';
  let str=[username,checkPass,region,u_id];
  connect.query(sql, str,(err, rst) => {
    if (err) {

      res.send({ "ok": false, "msg": "修改失败！" });
    } else {
      //rst=JSON.parse(rst);
      res.send({ "ok": true, "msg": "修改成功！" });
      // res.send(results);
    }
  });
});

//修改密码
router.post('/pwdEdit', (req, res) => {
  
  let {pass} = req.body;
  let id=req.cookies.u_id;
  // console.log(id,pwd)
  // //加密
  pass = utility.md5(pass);
  //修改
  let sql = 'update usertable set userPwd=? where u_id=?';
  let str=[pass,id];
  connect.query(sql, str,(err, rst) => {
    if (err) {
      res.send({ "ok": false, "msg": "修改失败！" });
    } else {
      res.send({ "ok": true, "msg": "修改成功！" });

    }
  });
});

//登录
router.post('/login', (req, res) => {
  //获取登录的值
  let { username, checkPass } = req.body;
 
  //加密
  checkPass = utility.md5(checkPass);
  //console.log(checkPass);
  let sql = 'select u_id from usertable where userName=? and userPwd=?';
   let s=[username,checkPass]
  connect.query(sql, s,(err, rst) => {
    if (err) {
      res.send({ "ok": false, "msg": "登录失败！用户名或密码" });
    } else {
      if(rst.length>0){
        res.cookie("username",username);
        res.cookie("u_id",rst[0].u_id);
        res.send({ "ok": true, "msg": "登录成功！" });
      }
      else {
        res.send({ "ok": false, "msg": "登录失败！用户名或密码!"});
      }
    }
  });
});
//退出系统
router.get("/loginout",(req,res)=>{
  //清空cookie值
  res.clearCookie("username");
  res.clearCookie("u_id");
  res.redirect('/login.html');
});
//拦截
router.get("/checkState",(req,res)=>{
  //获取登录名的username
  var username=req.cookies.username;
  //判断是否为空
  if(!username){
    res.send('alert("非法进入页面！请登录！");location.href="login.html";');
  }
  else{
    res.send();
  }
});

//密码修改
router.get("/pwd",(req,res)=>{
  //获取登录名的id 
  var id=req.cookies.u_id;
  let sql='select userPwd from usertable where  u_id=?';
  let str=[id];
  connect.query(sql,str,(err,rst)=>{
    if (err) {
      res.send({ "ok": false, "msg": "查询失败！" });
    } else {
      res.send({ "ok": true, "msg": "查询成功！",rst});
      // res.send(results);
    }
  });
  
});
module.exports = router;
