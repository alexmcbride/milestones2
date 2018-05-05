var mongoose = require('mongoose');
bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty'],
        length: 1
    },
    email: {
        type: String,
        required: [true, 'Email cannot be empty']
    },
    passwordHash: String,
    joined: {
        type: Date,
        default: Date.now
    }
});

// Get and set virtual password, hash when setting.
userSchema.virtual('password').get(function () {
    return this._password;
}).set(function (value) {
    this._password = value;
    var hash = bcrypt.hashSync(value, 10 /* salt rounds */);
    this.passwordHash = hash;
});

// Get and set virtual password confirmation.
userSchema.virtual('passwordConfirm').get(function () {
    return this._passwordConfirm;
}).set(function (value) {
    this._passwordConfirm = value;
});

userSchema.path('passwordHash').validate(function (v) {
    if (this._password || this._passwordConfirm) {
        if (this._password.trim().length < 6) {
            this.invalidate('password', 'Password cannot be fewer than 6 characters.');
        }
        if (this._password !== this._passwordConfirm) {
            this.invalidate('passwordConfirmation', 'Password must match confirmation.');
        }
    }

    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password cannot be empty');
    }
});

// Compare suppied password with one in DB.
userSchema.methods.auth = function (password, func) {
    bcrypt.compare(password, this.passwordHash, function (err, res) {
        if (err) console.log(err);
        func(res);
    });
};

userSchema.methods.login = function (session) {
    session.user = this;
}

userSchema.methods.logout = function (session, func) {
    session.destroy(function (err) {
        if (err) console.log(err);
        func();
    });
}

userSchema.methods.isLoggedIn = function (session) {
    return session.user != null;
}

var User = mongoose.model('User', userSchema);

module.exports = User;