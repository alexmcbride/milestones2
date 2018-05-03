var mongojs = require('mongojs')
var db = mongojs('milestones_db', ['milestones'])

var milestone = {
    findAll: function(callback, projectId) {
        db.milestones.find({projectId: mongojs.ObjectId(projectId)}, callback);
    },
    find: function(id, callback) {
        db.milestones.findOne({_id: mongojs.ObjectId(id)}, callback);
    },
    create: function(projectId, name, due, callback) {
        var milestone = {
            projectId: mongojs.ObjectId(projectId),
            name: name,
            due: due,
            created: new Date()
        };
        db.milestones.insert(milestone, callback);
    },
    update: function(id, name, due, completed, callback) {
        var milestone = {
            name: name,
            due: due,
            completed: completed
        }
        db.milestones.update({_id: mongojs.ObjectId(id)}, milestone, callback);
    },
    delete: function(id, callback) {
        db.milestones.remove({_id: mongojs.ObjectId(id)}, callback);
    }
};

module.exports = milestone;