const express = require('express');

const app = express(); //By convention we call this object app

app.get('/rpi',function(req,res){

	//console.log(req)
    res.send('Hello World');

});


app.get('/',function(req,res){

	res.send("Greetings from root")
});

app.post('/',(req,res)=>{
	
	console.log(req)
	res.send("picked up your message")
});
app.listen(8080,function(err){
	
	if(err){
		console.log(err)
	}

	console.log('NodeJS server started at port 8080')
});
