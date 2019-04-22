var mysql = require('mysql');
var express=require('express');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Panorama1#",
    //database: "mydb",
    //port: "3000"
});

var app = express();
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

let sql = 'CREATE DATABASE camdb1'
con.query(sql,(err,result)=>{
    if(err)throw err;
    console.log(result);
});

app.listen(3000,()=>{
    console.log('app started listening at port 3000');
});
