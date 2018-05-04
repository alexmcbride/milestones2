var express = require('express');
var router = express.Router();
var Milestone = require('../models/milestone');

router.get('/create/:projectId', function (req, res) {

    var milestone = new Milestone({
        projectId: req.params.projectId, 
        due: new Date()});
    res.render('milestones/create', { milestone: milestone });
});

router.post('/create/:projectId', function (req, res) {
    var projectId = req.params.projectId;
    var milestone = new Milestone({
        projectId: projectId, 
        name: req.body.name,
        due: req.body.due,
        completed: req.body.due,
        created: new Date(),
    });
    milestone.save(function(err, milestone) {
        if (err) res.status(500).end(err);
        res.redirect('/projects/' + projectId);
    });
});

module.exports = router;
