var mongoose = require('mongoose');
var moment = require('moment');

var Resource = require('./resource');

var milestoneSchema = mongoose.Schema({
    projectId: { type: String, required: true },
    userId: {type: String, required: true},
    name: { type: String, required: [true, 'Name cannot be empty'] },
    due: { type: Date, required: [true, 'Due cannot be empty'] },
    completed: { 
        type: Date, 
        validate: {
            validator: function(v) {
                return v && moment(v).isBefore();
            },
            message: 'Milestone cannot be completed in the future'
        } 
    },
    created: { type: Date, required: true, default: Date.now }
});

milestoneSchema.methods.create = function(done) {
    var params = {
        userId: this.userId,
        resourceId: this._id,
        resourceType: 'milestone',
        accessType: 'owner'
    };

    this.save(function(err) {
        if (err) {
            return done(err);
        }

        var resource = new Resource(params);
        resource.save(function(err) {
            done(err);
        });
    });
}

milestoneSchema.virtual('duePretty').get(function() {
    return moment(this.due).fromNow();
});

milestoneSchema.virtual('isLate').get(function() {
    return this.completed == null && moment(this.due).isBefore(new Date());
});

milestoneSchema.virtual('isComplete').get(function () {
    return this.completed != null
});

var Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;
