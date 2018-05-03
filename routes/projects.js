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

router.get('/edit/:id', function(req, res) {
  projectdb.find(req.params.id, function(err, project) {
    res.render('projects-edit', {project: project});
  });
});

router.post('/edit/:id', function(req, res) {
  projectdb.update(req.params.id, req.body.name, function(err, project) {
    res.redirect('/');
  });
});

router.get('/delete/:id', function(req, res) {
  projectdb.find(req.params.id, function(err, project) {
    res.render('projects-delete', {project: project});
  });
});

router.post('/delete/:id', function(req, res) {
  projectdb.delete(req.params.id, function(err, project) {
    res.redirect('/');
  });
});

router.get('/:id', function(req, res) {
  projectdb.find(req.params.id, function(err, project) {
    res.render('projects-detail', {project: project});
  });
});

module.exports = router;
