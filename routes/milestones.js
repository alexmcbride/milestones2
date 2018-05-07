var express = require('express');
var router = express.Router();
var Milestone = require('../models/milestone');
var authorize = require('../utils/authorize');

router.get('/create/:id', authorize('project'), function (req, res) {
    var milestone = new Milestone({
        projectId: req.params.id, 
        due: new Date()});
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
    milestone.create(function(err) {
        if (err) {
            res.render('milestones/create', { milestone: milestone, errors: err.errors });
        }
        else {
            res.flashMessages.add('Milestone created', 'success');
            res.redirect('/projects/' + projectId);
        }        
    });
});

module.exports = router;
