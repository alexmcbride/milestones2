var mongoose = require('mongoose');
var moment = require('moment');
var Permission = require('../models/permission');

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
});

projectSchema.virtual('createdPretty').get(function() {
    var date = moment(this.created).fromNow();
    return date.charAt(0).toUpperCase() + date.substr(1);
});

projectSchema.methods.createProject = function(done) {
    var perm = {
        resourceType: 'project',
        resourceId: this._id,
        userId: this.userId,
        permissionType: 'owner'
    };

    this.save(function(err) {
        if (err) {
            return done(err);
        }

        var permission = new Permission(perm);
        permission.save(function(err) {
            done(err);
        });
    })
};

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
