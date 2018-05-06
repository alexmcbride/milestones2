var Permission = require('../models/permission');

function authorize(resourceType) {
    return function (req, res, next) {
        var error = function () {
            res.flashMessages.add('You do not have permission to view that page', 'warning');
            res.redirect('/users/login');
        };

        if (req.userManager.loggedIn()) {
            if (resourceType) {
                var query = {
                    userId: req.userManager.userId(),
                    resourceId: req.params.id,
                    resourceType: resourceType
                };
                Permission.findOne(query, function (err, permission) {
                    if (permission) next();
                    else error();
                });
            }
            else next();
        }
        else error();
    };
}

module.exports = authorize;
