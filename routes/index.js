var express = require('express');
var router = express.Router();
var Project = require('../models/project');

/* GET home page. */
router.get('/', function (req, res) {
    if (req.userManager.loggedIn()) {
        var userId = req.userManager.userId();
        Project.find({ userId: userId }, function (err, projects) {
            if (err) throw err;
            res.render('projects/index', { projects: projects });
        });
    }
    else {
        res.render('projects/welcome');
    }

});

module.exports = router;
