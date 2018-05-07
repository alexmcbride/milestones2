var express = require('express');
var router = express.Router();
var Project = require('../models/project');
var Milestone = require('../models/milestone');
var authorize = require('../utils/authorize');

/* GET create project form */
router.get('/create', authorize(), function (req, res) {
    res.render('projects/create', { project: { name: '' } });
});

/* POST create project */
router.post('/create', authorize(), function (req, res, next) {
    var project = new Project({
        userId: req.userManager.userId(),
        name: req.body.name
    });
    project.create(function (err) {
        if (err) {
            res.render('projects/create', { project: project, errors: err.errors });
        }
        else {
            res.flashMessages.add('Project created', 'success');
            res.redirect('/');
        }
    });
});

/* GET edit project form */
router.get('/edit/:id', authorize('project'), function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end();
        res.render('projects/edit', { project: project });
    });
});

/* POST edit project */
router.post('/edit/:id', authorize('project'), function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end();
        project.name = req.body.name;
        project.save(function (err) {
            if (err) {
                res.render('projects/edit', { project: project, errors: err.errors });
            }
            else {
                res.flashMessages.add('Project edited', 'success');
                res.redirect('/');
            }
        });
    });
});

/* GET delete project form */
router.get('/delete/:id', authorize('project'), function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end();
        res.render('projects/delete', { project: project });
    });
});

/* POST delete project */
router.post('/delete/:id', authorize('project'), function (req, res) {
    Project.findById(req.params.id, function (err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end();
        project.delete(function (err) {
            if (err) return console.log(err);
            res.flashMessages.add('Project deleted', 'success');
            res.redirect('/');
        });
    });
});

module.exports = router;
