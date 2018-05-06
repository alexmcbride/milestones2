var Resource = require('../models/resource');

function authorize(resourceType) {
    return function (req, res, next) {
        var error = function () {
            res.flashMessages.add('You do not have permission to view that page', 'warning');
            res.redirect('/users/login');
        };

        if (!req.userManager.loggedIn()) {
            return error();
        }

        // Only do permission lookup if resourceType specified.
        if (!resourceType) {
            return next();
        }

        var query = {
            userId: req.userManager.userId(),
            resourceId: req.params.id,
            resourceType: resourceType
        };
        Resource.findOne(query, function (err, allowed) {
            if (allowed) {
                return next();
            }
            error();
        });
    };
}

module.exports = authorize;
