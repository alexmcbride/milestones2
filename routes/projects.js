var express = require('express');
var router = express.Router();
var projectdb = require('../models/projectdb');

/* GET home page. */
router.get('/', function(req, res) {
  projectdb.findAll(function(err, projects) {
    res.render('projects', {projects: projects});
  });
});

router.get('/create', function(req, res) {
  res.render('projects-create');
});

router.post('/create', function(req, res) {
  projectdb.create(req.body.name, function(err, project) {
    res.redirect('/');
  });
});

module.exports = router;
