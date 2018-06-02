var http = require('http');
var path = require('path');
var express = require('express');
var logger = require('morgan');
var bodiParser = require('body-parser');

var app = express();
app.set('views', path.resolve(__dirname,'views'));
app.set('view engine', 'ejs');
var entries = [];

var ip_normal=['192.168.30.1','192.168.90.1','::1'];
var aux;

app.locals.entries = entries;
app.use("/victimas",(request,response,next)=> {
    for(var i=0; i<ip_normal.length; i++) {
        if(request.ip===ip_normal[i]) {
            aux=ip_normal[i];
        }
    }
    if(request.ip===aux) {
        next();
    }
    else {
        response.status(401).send("No puedes acceder");
    }
});

app.use(logger('dev'));
app.use(bodiParser.urlencoded({ extended:false}));

app.get('/',(request, response) => response.render('index'));

app.get('/clases',(request, response) => response.render('clases'));
app.get('/victimas',(request, response) => response.render('victimas'));
app.get('/armas',(request, response) => response.render('armas'));
app.get('/new-entry',(request, response) => response.render('new-entry'));


app.post('/victimas',(request, response) => {
    if(!request.body.title || !request.body.body) {
        response.status(400).send('Las entradas deben tener un nombre y el zombie');
        return;
    }
    entries.push({
        title:request.body.title,
        body:request.body.body,
        created: new Date()
    });
    response.redirect('/');
});
app.use((request, response) => response.status(404).render('404'));
http.createServer(app).listen(3000,() =>
    console.log('La aplicacion esta corriendo en el puerto 3000'));
