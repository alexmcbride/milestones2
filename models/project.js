var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    name: String,
    created: Date
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
