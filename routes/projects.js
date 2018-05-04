var express = require('express');
var router = express.Router();
var Project = require('../models/project');

/* GET create project form */
router.get('/create', function (req, res) {
    res.render('projects/create', { project: { name: '' } });
});

/* POST create project */
router.post('/create', function (req, res, next) {
    var project = new Project({name: req.body.name, created: new Date()});
    project.save(function(err, project) {
        if (err) res.status(500).end(err);
        res.redirect('/');
    });
});

/* GET edit project form */
router.get('/edit/:id', function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err) res.status(500).end(err);
        if (!project) res.status(404).end();
        res.render('projects/edit', { project: project });
    });
});

/* POST edit project */
router.post('/edit/:id', function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err) res.status(500).end(err);
        if (!project) res.status(404).end();
        project.name = req.body.name;
        project.save();
        res.redirect('/');
    });
});

/* GET delete project form */
router.get('/delete/:id', function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err) res.status(500).end(err);
        if (!project) res.status(404).end();
        res.render('projects/delete', { project: project });
    });
});

/* POST delete project */
router.post('/delete/:id', function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err) res.status(500).end(err);
        if (!project) res.status(404).end();
        project.remove();
        res.redirect('/');
    });
});

/* GET single project */
router.get('/:id', function (req, res) {
    Proect.findById(req.params.id, function (err, project) {
        if (err) res.status(500).end(err);
        if (!project) res.status(404).end();
        res.render('projects/details', { project: project, milestones: [] });
    });
});

module.exports = router;
