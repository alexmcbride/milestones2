var bcrypt = require('bcrypt');

function UserManager(session) {
    this.session = session;
    this.user = session.user;
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

UserManager.prototype.logout = function (func) {
    this.session.destroy(function (err) {
        if (err) return console.log(err);
        func();
    });
}

UserManager.prototype.loggedIn = function () {
    return this.session.user != null;
}

module.exports = UserManager;
