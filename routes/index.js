var express = require('express');
var router = express.Router();
var projectdb = require('../models/projectdb');

/* GET home page. */
router.get('/', function(req, res) {
  projectdb.findAll(function(err, projects) {
    res.render('projects/index', {projects: projects});
  });
});

module.exports = router;
