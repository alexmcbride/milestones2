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
});

projectSchema.virtual('createdPretty').get(function() {
    var date = moment(this.created).fromNow();
    return date.charAt(0).toUpperCase() + date.substr(1);
});

projectSchema.methods.create = function(done) {
    // Set this here to avoid 'this' scope isues.
    var options = {
        resourceType: 'project',
        resourceId: this._id,
        userId: this.userId,
        permissionType: 'owner'
    };

    this.save(function(err) {
        if (err) {
            return done(err);
        }

        var resource = new Resource(options);
        resource.save(function(err) {
            done(err);
        });
    })
};

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
