var bcrypt = require('bcrypt');

function UserManager(session) {
    this.session = session;
}

UserManager.prototype.auth = function (user, password, func) {
    bcrypt.compare(password, user.passwordHash, function (err, res) {
        if (err) return console.log(err);
        func(res);
    });
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

module.exports = UserManager;
