//实例化modules
var express = require('express');
var http = require('http');
var session = require("express-session");
var cors = require('cors');
var app = express();
//视图引擎
app.set('view engine', 'ejs');
http.createServer(app).listen(3000);

var user=require('./routes/user');
var article=require('./routes/article');
var index=require('./routes/index');

app.locals['userinfo'] = 'admin';

//app.use配置中间件

app.use('/user',user);
app.use('/article',article);
app.use('/index',index);

app.use(cors());
//允许跨域解决
// https://www.npmjs.com/package/cors
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  rolling: true
}))
//https://www.npmjs.com/package/express-session
app.use('/upload', express.static('upload'));

//Check login status
app.use(function (req, res, next) {
  app.locals['userinfo'] = '';
  next();
  // if (req.url == '/user/login' || req.url == '/user/doLogin') {
  //   next();
  // } else {
  //   if (req.session.userinfo && req.session.userinfo.username != '') {
  //     app.locals['userinfo'] = req.session.userinfo;
  //     //app.locals对象用于将数据传入所有的渲染ejs模板中，用<%=username%>接收
  //     // https://www.cnblogs.com/luowenshuai/p/9347950.html
  //     next();
  //   } else {
  //     res.redirect('/user/login')
  //   }
  // }
})
app.get('/', function (req, res) {
  res.redirect('index');
})

