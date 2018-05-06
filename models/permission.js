var mongoose = require('mongoose');

var permissionSchema = mongoose.Schema({
    userId: String,
    resourceId: String,
    resourceType: String,
    permissionType: String
});

var Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
