var mongoose = require('mongoose');
var moment = require('moment');

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

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
