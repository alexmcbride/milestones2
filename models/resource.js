var mongoose = require('mongoose');

var resourceSchema = mongoose.Schema({
    userId: String,
    resourceId: String,
    resourceType: String,
    accessType: String
});

var Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
