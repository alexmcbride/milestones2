var mongoose = require('mongoose');

var milestoneSchema = mongoose.Schema({
    projectId: String,
    name: String,
    due: Date,
    completed: Date,
    created: Date
});

var Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;
