var express = require('express');
var router = express.Router();
var milestoneModel = require('../models/milestone');
var { validationResult } = require('express-validator/check');

router.get('/create/:projectId', function (req, res) {
    var projectId = req.params.projectId;
    var milestone = { 
        name: '', 
        due: new Date().toISOString()
    };
    res.render('milestones/create', { milestone: milestone });
});

router.post('/create/:projectId', milestoneModel.validations, function (req, res) {
    var milestone = { 
        name: req.body.name,
        due: req.body.due
    };
    var errors = validationResult(req);
    if (errors.isEmpty()) {
        var projectId = req.params.projectId;
        milestoneModel.create(projectId, milestone, function (err, milestone) {
            res.redirect('/projects/' + projectId);
        });
    }
    else {
        res.render('milestones/create', { milestone: milestone, errors: errors.mapped() });
    }
});

module.exports = router;
