var bcrypt = require('bcrypt');

function UserManager(session) {
    this.session = session;
}

UserManager.prototype.auth = function (user, password, done) {
    bcrypt.compare(password, user.passwordHash, done);
};

UserManager.prototype.login = function (user) {
    this.session.user = user;
}

UserManager.prototype.logout = function () {
    this.session.user = null;
}

UserManager.prototype.loggedIn = function () {
    return this.session.user != null;
}

UserManager.prototype.user = function () {
    return this.session.user;
}

UserManager.prototype.userId = function() {
    return this.session.user._id;
}

module.exports = UserManager;
