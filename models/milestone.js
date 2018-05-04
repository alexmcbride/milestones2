var mongoose = require('mongoose');
var moment = require('moment');

var milestoneSchema = mongoose.Schema({
    projectId: { type: String, required: true },
    name: { type: String, required: [true, 'Name cannot be empty'] },
    due: { type: Date, required: [true, 'Due cannot be empty'] },
    completed: { 
        type: Date, 
        validate: {
            validator: function(v) {
                return v && moment(v).isBefore();
            },
            message: 'Milestone cannot be completed in future'
        } 
    },
    created: { type: Date, required: true, default: Date.now }
});

milestoneSchema.methods.duePretty = function() {
    return moment(this.due).fromNow();
};

milestoneSchema.methods.isLate = function () {
    var now = new Date();
    return this.completed == null && moment(this.due).isBefore(now);
};

milestoneSchema.methods.isComplete = function () {
    return this.completed != null
};

var Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;
