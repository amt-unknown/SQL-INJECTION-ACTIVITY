const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.static('.'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

//Iniitalize database and create initial table and data
const db = new sqlite3.Database(`:memory:`);
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

//Creates root page
app.get('/', function(req, res) {
    res.sendFile('index.html')
});

//Creates login page
app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var query = "SELECT title FROM user WHERE username = '" + username + "' and password = '" + password + "'";

    console.log("username: " + username);
    console.log("password: " + password);
    console.log("query: " + query);

    //Checks username and password and modifies page/redirects pending results
    db.get(query, function(err, row) {
        if(err) {
            console.log('ERROR', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
        }
    });
});

app.listen(3000);