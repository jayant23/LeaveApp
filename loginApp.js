var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');


// put the credentials to coonect with database
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '12345',
	database : 'nodelogin'
});

//Express is what we'll use for our web applications, this includes packages useful in web development, such as sessions and handling HTTP requests, to initialize it we can do:
var app = express();

//We now need to let Express know we'll be using some of its packages:


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.render('./login.ejs');
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.get('/home', function(request, response) {

	if (request.session.loggedin) {
		response.render('/home.ejs', {
			username: request.session.username
		});
		//response.send('Welcome back, <h1>' +  + '</h1>!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);