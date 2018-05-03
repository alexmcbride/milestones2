var express = require('express');
var router = express.Router();
var projectModel = require('../models/project');
var { validationResult } = require('express-validator/check');

/* GET create project form */
router.get('/create', function (req, res) {
    res.render('projects/create', { project: { name: '' } });
});

/* POST create project */
router.post('/create', projectModel.validations, function (req, res, next) {
    var errors = validationResult(req);
    if (errors.isEmpty()) {
        projectModel.create(req.body.name, function (err, project) {
            res.redirect('/');
        });
    }
    else {
        var project = { name: req.body.name };
        res.render('projects/create', { project: project, errors: errors.mapped() });
    }
});

/* GET edit project form */
router.get('/edit/:id', function (req, res) {
    projectModel.find(req.params.id, function (err, project) {
        res.render('projects/edit', { project: project });
    });
});

/* POST edit project */
router.post('/edit/:id', projectModel.validations, function (req, res) {
    var errors = validationResult(req);
    if (errors.isEmpty()) {
        projectModel.update(req.params.id, req.body.name, function (err, project) {
            res.redirect('/');
        });
    }
    else {
        var project = { name: req.body.name };
        res.render('projects/edit', { project: project, errors: errors.mapped() });
    }
});

/* GET delete project form */
router.get('/delete/:id', function (req, res) {
    projectModel.find(req.params.id, function (err, project) {
        res.render('projects/delete', { project: project });
    });
});

/* POST delete project */
router.post('/delete/:id', function (req, res) {
    projectModel.delete(req.params.id, function (err, project) {
        res.redirect('/');
    });
});

/* GET single project */
router.get('/:id', function (req, res) {
    projectModel.find(req.params.id, function (err, project) {
        res.render('projects/details', { project: project });
    });
});

module.exports = router;
