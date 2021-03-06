var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var ejs = require('ejs');
var app = express();

var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(expressValidator());

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://127.0.0.1/4db", function(err,db){

	if(!err)
	{
		console.log("We are connected");
		app.get('/', function(req,res){
			res.send("Welcome");
		})
		app.get('/index4.html', function(req,res){
			res.sendFile(__dirname + '/' + 'index4.html')
		})
		app.post('/process_post', urlencodedParser, function(req,res){
			var EMPID=req.body.empID
			var NAME=req.body.name
			var DEPT=req.body.dept
			var DESIGNATION=req.body.desg
			var MOB=req.body.mob
			var EMAIL=req.body.email
			
			db.collection('empDetails').insert({"empID":EMPID,"Name":NAME,"dept":DEPT,"designation":DESIGNATION,"mobile":MOB,"emailId":EMAIL}, function(err,doc){
			if(err)
				return console.log(err)
			})	
			console.log("New Record Inserted");
			res.send("<p>EMPID:"+EMPID+"</p><p>Name:"+NAME+"</p><p>DEPARTMENT:"+DEPT+"</p><p>DESIGNATION:"+DESIGNATION+"</p><p>MOB:"+MOB+"</p><p>EMAIL:"+EMAIL+"</p>");
			
		})

		app.get('/display', function(req, res){
			db.collection('empDetails').find().toArray(function (err, i){
				if(err)
					return console.log(err)
				res.render('45.ejs', {employee:i});
			});
		})	

		app.get('/sort', function(req, res){
			db.collection('empDetails').find().sort({empID:1}).toArray(function (err, i){
				if(err)
					return console.log(err)
				res.render('45.ejs', {employee:i});
			});
		})	

		var server = app.listen(5060, function(){
			var host = server.address().address;
			var port = server.address().port;
			console.log("Listening at http://%s:%s",host,port);
		})
	}
	else
	{
		db.close();
	}

})
