var mongoose = require('mongoose');
var moment = require('moment');
var Resource = require('../models/resource');

var projectSchema = mongoose.Schema({
    userId: String,
    name: {
        type: String,
        required: [true, 'Name cannot be blank'],
        validate: {
            validator: function (v) {
                return v && v.length <= 100;
            },
            message: 'Name cannot contain more than 100 characters'
        }
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    milestoneCount: {
        type: Number,
        required: true,
        default: 0
    }
});

projectSchema.virtual('createdPretty').get(function () {
    var date = moment(this.created).fromNow();
    return date.charAt(0).toUpperCase() + date.substr(1);
});

projectSchema.methods.create = function (done) {
    this.save(function (err) {
        if (err) {
            return done(err);
        }

        // Add a resource for this project
        var resource = new Resource( {
            resourceType: 'project',
            resourceId: this._id,
            userId: this.userId,
            permissionType: 'owner'
        });
        resource.save(done);
    }.bind(this));
};

projectSchema.methods.addMilestone = function (milestone, done) {
    milestone.projectId = this._id;
    milestone.create(function (err) {
        if (err) {
            return done(err);
        }

        this.milestoneCount++;
        this.save(done);
    }.bind(this));
}

projectSchema.methods.removeMilestone = function (milestone, done) {
    milestone.delete(function (err) {
        if (err) {
            return done(err);
        }

        this.milestoneCount--;
        this.save(done);
    }.bind(this));
}

projectSchema.methods.delete = function (done) {
    this.remove();

    Resource.remove({ resourceId: this._id, resourceType: 'project' }, done);
};

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
