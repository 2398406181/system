var express = require('express');
var router = express.Router();

//引入自定义模块
var connect=require("./common");

/* GET users listing. */
//分类添加
router.post("/add", function (req, res, next) {
  //接收数据
  let { c_name, c_parentid, c_islocked } = req.body;
  //console.log(c_name, c_parentid, c_islocked);
  
  let sql = 'insert into cg (c_name,c_parentid,c_islocked) values (?,?,?)';
 let str=[c_name, c_parentid, c_islocked]
  connect.query(sql, str,function (error, results, fields) {
    if (error) {
      res.send({ "ok": false, "msg": "添加失败！" });
    } else {
      res.send({ "ok": true, "msg": "添加成功！" });
    }

  });

});
//分类管理
router.get("/list", (req, res) => {
  let sql = "select * from cg order by c_id desc";
  connect.query(sql, function (error, results, fields) {
    if (error) {
      res.send({ "ok": false, "msg": "查询失败！" });
    } else {    
      res.send({ "ok": true, "msg": "查询成功！", "data": results });
    }
  });
});

//账号删除
router.get('/del', (req, res) => {
  //获取传递的值
  let id = req.query.c_id;
  console.log(id);

  let sql = `delete from cg where c_id=${id}`;
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
  let sql = `select * from cg where c_id=${id}`;
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
  
  let {c_parentid,c_name,c_islocked,c_id} = req.body;

  //修改
  let sql = 'update cg set c_name=?,c_parentid=?,c_islocked=? where c_id=?';
  let str=[c_name,c_parentid,c_islocked,c_id];
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


module.exports = router;
