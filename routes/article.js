var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
var sd = require('silly-datetime');
var DB = require('../modules/DB');
var cors = require('cors');


router.use(cors());
router.get('/', function (req, res) {
    DB.find('article', {}, function (err, data) {
        // console.log(data);
        res.render('article', {
            list: data
        });
    })
})

router.get('/add', function (req, res) {
    res.render('add_article');
})
router.get('/list', function (req, res) {
    DB.find('article', {}, function (err, data) {
        res.json(data)
    })
})

router.post('/addData', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = 'upload';
    //https://www.npmjs.com/package/multiparty
    form.parse(req, function (err, fields, files) {
        // form.parse(request, [cb])

        DB.insert('article', {
            title: fields.title[0],
            by: fields.by[0],
            likes: fields.likes[0],
            level: fields.level[0],
            content: fields.content[0],
            pic: files.pic[0].path,
            last_edit_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
        }, function (err, data) {
            if (!err) {
                res.redirect('/article');
            }
        })
    });
})

router.get('/toEdit', function (req, res) {
    var id = req.query.id;
    console.log(id);
    DB.find('article', { "_id": new DB.ObjectID(id) }, function (err, data) {
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.render('edit_article', {
        list: data[0]
      });
    });
  })
router.post('/edit', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = 'upload';
    form.parse(req, function (err, fields, files) {
      var _id = fields._id[0];
      var originalFilename = files.pic[0].originalFilename;
      var pic = files.pic[0].path;
  
      if (originalFilename) {  /*picture was modified*/
        var updata = {
          title: fields.title[0],
          by: fields.by[0],
          likes: fields.likes[0],
          level: fields.level[0],
          content: fields.content[0],
          pic: files.pic[0].path,
          last_edit_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
        };
      } else { /*picture not modified*/
        var updata = {
          title: fields.title[0],
          by: fields.by[0],
          likes: fields.likes[0],
          level: fields.level[0],
          content: fields.content[0],
          last_edit_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
        };
        
        //delete temp_pic
        fs.unlink(pic,function(err,result){
            if(!err){
              console.log("delete temp_pic path failed")
            }
        });
      }
      DB.update('article', { "_id": new DB.ObjectID(_id) }, updata, function (err, data) {
        if (!err) {
          res.redirect('/article');
        }
      })
    });
  })

router.get('/delete', function (req, res) {
    var id = req.query.id;
    DB.deleteOne('article', { "_id": new DB.ObjectID(id) }, function (err) {
        if (!err) {
            res.redirect('/article');
        }
    })
})
module.exports = router;
// http://www.expressjs.com.cn/guide/routing.html