var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    //clean up session
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/login');
      }
    })
  })

  module.exports = router;
  // http://www.expressjs.com.cn/guide/routing.html