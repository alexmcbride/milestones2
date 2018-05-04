var mongoose = require('mongoose');
var moment = require('moment');

var projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be blank'],
        validate: {
            validator: function(v) {
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

projectSchema.methods.createdPretty = function() {
    return moment(this.created).format('YYYY/MM/DD HH:mm');
};

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
