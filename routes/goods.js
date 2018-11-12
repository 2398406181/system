var express = require('express');
var router = express.Router();

//引入自定义模块
var connect=require("./common");

/* GET users listing. */
//商品添加
router.post("/add", function (req, res, next) {

  //接收数据
  
  let { cg_id, barcode, goodsname, saleprice,marketprice,goodsprice,stockNum,weigth,unit,discount,promotion,goodsDetails,total_price,sales_price} = req.body;
  //console.log(c_name, c_parentid, c_islocked);
  
  let sql = 'insert into goodstable (cg_id, barcode, goodsname, saleprice,marketprice,goodsprice,stockNum,weigth,unit,discount,promotion,goodsDetails,total_price,sales_price) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
 let str=[cg_id, barcode, goodsname, saleprice,marketprice,goodsprice,stockNum,weigth,unit,discount,promotion,goodsDetails,total_price,sales_price]
  connect.query(sql, str,function (error, results, fields) {
    if (error) {
      res.send({ "ok": false, "msg": "添加失败！" });
    } else {
      res.send({ "ok": true, "msg": "添加成功！" });
    }

  });

});
//商品管理
router.get("/list", (req, res) => {
  let {currentPage,pageSize,cate,search}=req.query;
 
  let sql = "select t1.*,t2.c_name as name from goodstable as t1 left join cg as t2 on t1.cg_id=t2.c_id where 1=1";
  connect.query(sql, function (error, results, fields) {
    if (error) {
      res.send({ "ok": false, "msg": "查询失败！" });
    } else { 
      let total=results.length;//总数据条数
      //查询条件
      if(search.length>0){
        sql+=` and (t1.barcode like '%${search}%' or t1.goodsname like '%${search}%')`;
      }
      if(cate.length>0){
        sql+=` and cg_id=${cate}`;
      }
      if(cate.length>0||search.length>0){
        connect.query(sql,(err,searchl)=>{
          if(err) throw err;
          total=searchl.length;
        });
      }
      //分页
      let skip=(currentPage-1)*pageSize;//跳过多少条
      let str=[skip,parseInt(pageSize)];
      sql+=' limit ?,?';//限制查询
      connect.query(sql,str,(err,rst)=>{
        if(err) throw err;
        res.send({"total":total,"data":rst});
      });
    }
  });
});

//商品管理删除
router.get('/del', (req, res) => {
  //获取传递的值
  let id = req.query.good_id;
 // console.log(id);

  let sql = `delete from goodstable where good_id=${id}`;
  connect.query(sql, (err, rst) => {
    if (err) {
      res.send({ "ok": false, "msg": "删除失败！" });
    } else {
      res.send({ "ok": true, "msg": "删除成功！" });

    }
  });
});
//商品修改显示
router.get('/editList', (req, res) => {
  let id = req.query.id;
  let sql = `select * from goodstable where good_id=${id}`;
  connect.query(sql, (err, rst) => {
    if (err) {
      res.send({ "ok": false, "msg": "查询失败！" });
    } else {
      res.send({ "ok": true, "msg": "查询成功！", "data": rst });
    }
  });
});
//修改内容
router.post('/edit', (req, res) => {
  
  let { cg_id, barcode, goodsname, saleprice,marketprice,goodsprice,stockNum,weigth,unit,discount,promotion,goodsDetails,total_price,sales_price,good_id} = req.body;

  //修改
  let sql = 'update goodstable set cg_id=?,barcode=?,goodsname=?,goodsprice=?,marketprice=?,saleprice=?,stockNum=?,weigth=?,unit=?,discount=?,promotion=?,goodsDetails=?,total_price=?,sales_price=?  where good_id=?';
  let str=[cg_id, barcode, goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,discount,promotion,goodsDetails,total_price,sales_price,good_id];
  connect.query(sql, str,(err, rst) => {
    if (err) {
      res.send({ "ok": false, "msg": "修改失败！" });
    } else {  
      res.send({ "ok": true, "msg": "修改成功！" });
    }
  });
});


module.exports = router;
