var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty'],
        length: 1,
        validate: {
            isAsync: true,
            validator: function (v, cb) {
                User.findOne({ username: v }, function (err, user) {
                    cb(user == null, 'Username already exists');
                });
            }
        }
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: [true, 'Email cannot be empty'],
        validate: {
            isAsync: true,
            validator: function (v, cb) {
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                if (!emailRegex.test(v)) {
                    cb(false, 'Email is not valid');
                }
                User.findOne({ email: v }, function (err, user) {
                    cb(user == null, 'Email already exists');
                });
            },
        }
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

var User = mongoose.model('User', userSchema);

module.exports = User;