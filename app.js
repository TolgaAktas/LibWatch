const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var app = express();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "libwatch1@",
    database: "cambase",
    //port: "3000"
});

con.connect(function(err){
    if(err)throw err;
    console.log("Connected to DB");
    
});

let createDB = 'CREATE DATABASE IF NOT EXISTS cambase'
con.query(createDB,(err,result)=>{
    if(err)throw err;
    console.log("DB: cambase created successfully")
    console.log(result);
    console.log("\n\n\n")
});

let createTable = 'CREATE TABLE IF NOT EXISTS camtable(id INT AUTO_INCREMENT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id),UNIQUE(created_at))'
con.query(createTable,function(err,result){
    if(err)throw err;
    console.log("Table: camtable created successfully")
    console.log(result);
    console.log("\n\n\n")
});


app.use(bodyParser.json());

app.get('/rpi',function(req,res){
    //console.log(req)
    res.send('Hello World');
});


app.get('/',function(req,res){
    res.send("Greetings from root")
});

var firstPost = true

var boxName = [];
var insertID = 0; 
app.post('/:rpinumber',function(req,res){
    
    insertID++;
    var timestamp = Math.round(req.body.timestamp);
    var colNums = req.body.binCounts.length
    
    
    if(firstPost){
        for(var i = 0; i < colNums; i++){
            boxName[i] = "Box"+(i+1);
        }
        for(var i = 1; i <= colNums; i++){
            if(i == 1){
                var insrtCol = 'ALTER TABLE camtable ADD COLUMN Box1 INT AFTER created_at'
            }else{
                var insrtCol = 'ALTER TABLE camtable ADD COLUMN Box'+i+' INT AFTER Box'+(i-1)
            }
            
            var query = con.query(insrtCol,(err,result)=>{
                if(err){
                    console.log("COULDN'T ADD COLUMNS");
                    con.query("DROP TABLE camtable");
                    throw err;
                }
            });
        }
        console.log("ADDED ALL THE COLUMNS");
        firstPost = false
    }
    
    var binNumbers = []
    var counts = []

    for(var j = 0; j < colNums; j++){
        binNumbers.push(req.body.binCounts[j][0]);
        counts.push(req.body.binCounts[j][1]);
    }
    var insert = "INSERT INTO camtable VALUES("+insertID+",CURRENT_TIME(),?)";
    var query = con.query(insert,[counts],(err,result)=>{
        if(err){
            console.log("CANNOT INSERT ROW: " + insertID); 
            con.query("DROP TABLE camtable");
            throw err;
        }else{
            console.log("successfully inserted row: " + insertID);
        }
        
    });
    console.log(query.sql);
    res.sendStatus(200);i
});


app.listen(8080,function(err){
    if(err){
        console.log(err)
    }
    console.log('NodeJS server started at port 8080')
});
