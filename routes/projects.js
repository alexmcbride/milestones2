var express = require('express');
var router = express.Router();
var projectdb = require('../models/projectdb');

/* GET create project form */
router.get('/create', function(req, res) {
  res.render('projects/create');
});

/* POST create project */
router.post('/create', function(req, res) {
  projectdb.create(req.body.name, function(err, project) {
    res.redirect('/');
  });
});

/* GET edit project form */
router.get('/edit/:id', function(req, res) {
  projectdb.find(req.params.id, function(err, project) {
    res.render('projects/edit', {project: project});
  });
});

/* POST edit project */
router.post('/edit/:id', function(req, res) {
  projectdb.update(req.params.id, req.body.name, function(err, project) {
    res.redirect('/');
  });
});

/* GET delete project form */
router.get('/delete/:id', function(req, res) {
  projectdb.find(req.params.id, function(err, project) {
    res.render('projects/delete', {project: project});
  });
});

/* POST delete project */
router.post('/delete/:id', function(req, res) {
  projectdb.delete(req.params.id, function(err, project) {
    res.redirect('/');
  });
});

/* GET single project */
router.get('/:id', function(req, res) {
  projectdb.find(req.params.id, function(err, project) {
    res.render('projects/details', {project: project});
  });
});

module.exports = router;
