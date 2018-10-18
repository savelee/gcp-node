var express = require('express');
var router = express.Router();
var Controller = require('../lib/ml');
var ctrl = new Controller();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Machine Learning: Vision Demo' });
});
/* POST form. */
router.post('/do', function(req, res, next) {
  ctrl.submitHandler(req, res);
});


module.exports = router;
