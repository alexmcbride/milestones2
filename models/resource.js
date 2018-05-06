var mongoose = require('mongoose');

var resourceSchema = mongoose.Schema({
    userId: String,
    resourceId: String,
    resourceType: {
        type: String,
        enum: ['project', 'milestone']
    },
    accessType: {
        type: String,
        enum: ['owner', 'readonly', 'public']
    }
});

var Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
