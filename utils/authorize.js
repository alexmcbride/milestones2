function authorize(req, res, next) {
    if (!req.userManager.loggedIn()) {
        res.flashMessages.add('You do not have permission to view that page', 'warning');
        return res.redirect('/users/login');
    }
    next();
}

module.exports = authorize;
