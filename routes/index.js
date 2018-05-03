var express = require('express');
var router = express.Router();
var projectModel = require('../models/project');

/* GET home page. */
router.get('/', function (req, res) {
    projectModel.findAll(function (err, projects) {
        res.render('projects/index', { projects: projects });
    });
});

module.exports = router;
