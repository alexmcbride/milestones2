var express = require('express');
var router = express.Router();

var Project = require('../models/project');
var Milestone = require('../models/milestone');
var authorize = require('../utils/authorize');

/* GET milestones for single project */
router.get('/:id', authorize('project'), function (req, res) {
    var id = req.params.id;
    Project.findById(id, function (err, project) {
        if (!project) {
            return res.status(404).end();
        }

        Milestone.find({ projectId: id }).sort('due').exec(function (err, milestones) {
            res.render('milestones/index', { project: project, milestones: milestones });
        });
    });
});

router.get('/create/:id', authorize('project'), function (req, res) {
    var milestone = {
        projectId: req.params.id,
        due: new Date()
    };
    res.render('milestones/create', { milestone: milestone });
});

router.post('/create/:id', authorize('project'), function (req, res) {
    var projectId = req.params.id;
    var milestone = new Milestone({
        userId: req.userManager.userId(),
        projectId: projectId,
        name: req.body.name,
        due: req.body.due
    });
    milestone.create(function (err) {
        if (err) {
            res.render('milestones/create', { milestone: milestone, errors: err.errors });
        }
        else {
            res.flashMessages.add('Milestone created', 'success');
            res.redirect('/milestones/' + projectId);
        }
    });
});

router.get('/edit/:id', authorize('milestone'), function (req, res) {
    Milestone.findById(req.params.id, function (err, milestone) {
        if (milestone == null) {
            return res.status(404).end();
        }

        res.render('milestones/edit', { milestone: milestone });
    });
});

router.post('/edit/:id', authorize('milestone'), function (req, res) {
    var params = {
        name: req.body.name,
        due: req.body.due,
        completed: req.body.completed
    };

    Milestone.findByIdAndUpdate(req.params.id, params, function (err, milestone) {
        if (milestone == null) {
            return res.status(404).end();
        }

        if (err) {
            res.render('milestones/edit', { milestone: milestone, errors: err.errors });
        }
        else {
            res.flashMessages.add('Milestone edited', 'success');
            res.redirect('/milestones/' + milestone.projectId);
        }
    });
});

router.get('/delete/:id', function(req, res) {
    Milestone.findById(req.params.id, function (err, milestone) {
        if (milestone == null) {
            return res.status(404).end();
        }

        res.render('milestones/delete', { milestone: milestone });
    });
});

router.post('/delete/:id', function(req, res) {
    Milestone.findById(req.params.id, function (err, milestone) {
        if (milestone == null) {
            return res.status(404).end();
        }

        milestone.remove();
        res.flashMessages.add('Removed milestone', 'success');
        res.redirect('/milestones/' + milestone.projectId);
    });
});

module.exports = router;
