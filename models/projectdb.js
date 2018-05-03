var mongojs = require('mongojs')
var db = mongojs('milestones_db', ['projects'])

var projectdb = {
    findAll: function(callback) {
        db.projects.find(callback);
    },
    find: function(id, callback) {
        db.projects.findOne({_id: mongojs.ObjectId(id)}, callback);
    },
    create: function(name, callback) {
        var project = {
            name: name,
            created: new Date()
        };
        db.projects.insert(project, callback);
    }
};

module.exports = projectdb;