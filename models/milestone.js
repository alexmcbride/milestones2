var mongojs = require('mongojs')
var db = mongojs('milestones_db', ['milestones'])
var { body } = require('express-validator/check');

var milestone = {
    validations: [
        body('name', 'Name cannot be blank').isLength({ min: 1 }),
        body('name', 'Name cannot be longer than 100 characters').isLength({ max: 100 }),
        body('due', 'Due cannot be invalid').isISO8601()
    ],
    findAll: function (projectId, callback) {
        db.milestones.find({ projectId: mongojs.ObjectId(projectId) }, callback);
    },
    find: function (id, callback) {
        db.milestones.findOne({ _id: mongojs.ObjectId(id) }, callback);
    },
    create: function (projectId, milestone, callback) {
        milestone.projectId = mongojs.ObjectId(projectId);
        milestone.created = new Date();
        db.milestones.insert(milestone, callback);
    },
    update: function (id, milestone, callback) {
        db.milestones.update({ _id: mongojs.ObjectId(id) }, milestone, callback);
    },
    delete: function (id, callback) {
        db.milestones.remove({ _id: mongojs.ObjectId(id) }, callback);
    }
};

module.exports = milestone;