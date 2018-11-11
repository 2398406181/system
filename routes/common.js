

//引入mysql模块
var mysql = require("mysql");
var connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: "3306",
    database: "system"
  });
  
  //开始链接数据库
  connect.connect(function (err) {
    if (err) {
      console.log(`mysql连接失败: ${err}!`);
    } else {
      console.log("mysql连接成功!");
    }
  });
  module.exports=connect;