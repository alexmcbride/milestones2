var mongojs = require('mongojs');
var db = mongojs('milestones_db', ['projects']);
var { body } = require('express-validator/check');

var project = {
    validations: [
        body('name', 'Name cannot be blank').isLength({ min: 1 }),
        body('name', 'Name cannot be longer than 30 characters').isLength({ max: 30 })
    ],
    findAll: function (callback) {
        db.projects.find(callback);
    },
    find: function (id, callback) {
        db.projects.findOne({ _id: mongojs.ObjectId(id) }, callback);
    },
    create: function (project, callback) {
        project.created = new Date();
        db.projects.insert(project, callback);
    },
    update: function (id, project, callback) {
        db.projects.update({ _id: mongojs.ObjectId(id) }, project, callback);
    },
    delete: function (id, callback) {
        db.projects.remove({ _id: mongojs.ObjectId(id) }, callback);
    }
};

module.exports = project;
