var express = require('express');
var router = express.Router();
var Project = require('../models/project');

/* GET home page. */
router.get('/', function (req, res) {
    Project.find(function (err, projects) {
        if (err) console.error(err);

        res.render('projects/index', { projects: projects });
    });
});

module.exports = router;
