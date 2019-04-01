var express = require('express');
var router = express.Router();
var session = require("express-session");
var bodyParser = require('body-parser');
var sd = require('silly-datetime');
var DB = require('../modules/DB');
var cors = require('cors');


router.use(cors());
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    },
    rolling: true
}))
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
router.use(bodyParser.json())
// https://www.npmjs.com/package/body-parser



//https://www.npmjs.com/package/express-session
router.get('/login', function (req, res) {
    res.render('login');
})
router.post('/login_do', function (req, res) {
    var userid = req.body.userid;
    var password = req.body.password;
    // var password=md5(req.body.password);

    DB.find('userInf', {
        userid: userid,
        password: password
    }, function (err, data) {
        if (data.length > 0) {
            console.log('login success!');
            // req.session.userinfo = data[0];
            res.json({'status':"Verify success"});
        } else {
            console.log('login fail!');
            res.json({'status':"Verify fail"});
        }
    })
})

router.post('/doLogin', function (req, res) {
    var userid = req.body.userid;
    var password = req.body.password;
    // var password=md5(req.body.password);

    DB.find('userInf', {
        userid: userid,
        password: password
    }, function (err, data) {
        if (data.length > 0) {
            console.log('login success!');
            console.log(data);
            req.session.userinfo = data[0];
            res.redirect('/article');
        } else {
            //console.log('login fail!');
            res.send("<script>alert('login fail');location.href='/login'</script>");
        }
    })
})
router.get('/logout', function (req, res) {
    //clean up session
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("logout finish");
            res.redirect('login');
        }
    })
})
router.get('/info', function (req, res) {
    DB.find('userInf', {}, function (err, data) {
      console.log(data);
      res.render('user_inf', {
        list: data
      });
    })
  })
router.get('/add', function (req, res) {
    res.render('add_user');
})
router.post('/addUser', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = 'upload';
    //https://www.npmjs.com/package/multiparty
    form.parse(req, function (err, fields, files) {
        DB.insert('userInf', {
            userid: fields.userid[0],
            password: fields.password[0],
            pic: files.pic[0].path,
            last_edit_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
        }, function (err, data) {
            if (!err) {
                res.redirect('/user_inf');
            }
        })
    });
})

module.exports = router;
// http://www.expressjs.com.cn/guide/routing.html