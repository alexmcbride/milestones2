var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty'],
        length: 1,
        trim: true
    },
    email: {
        type: String,
        index: true,
        unique: true,
        trim: true,
        required: [true, 'Email cannot be empty'],
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

userSchema.path('passwordHash').validate({
    isAsync: true,
    validator: function (v, isvalid) {
        isvalid((this._password || this._passwordConfirm) && (this._password.trim().length >= 6));
    },
    message: 'Password cannot be fewer than 6 characters'
});

userSchema.path('passwordHash').validate({
    isAsync: true,
    validator: function (v, isvalid) {
        isvalid((this._password || this._passwordConfirm) && (this._password === this._passwordConfirm));
    },
    message: 'Password must match confirmation.'
});

userSchema.path('passwordHash').validate({
    isAsync: true,
    validator: function (v, isvalid) {
        if (this.isNew && !this._password) {
            isvalid(false);
        }
        else {
            isvalid(true);
        }
    },
    message: 'Password cannot be empty'
});

userSchema.path('username').validate({
    isAsync: true,
    validator: function (v, isvalid) {
        console.log(this.username);
        if (!this.isModified('username')) {
            console.log('mod');
            isvalid(true);
        }
        else {
            User.findOne({ username: v }, function (err, user) {
                isvalid(user ? true : false);
            });
        }
    },
    message: 'Username already exists'
});

userSchema.path('email').validate({
    isAsync: true,
    validator: function (v, isvalid) {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        isvalid(emailRegex.test(v));
    },
    message: 'Email is not valid'
});

userSchema.path('email').validate({
    isAsync: true,
    validator: function (v, isvalid) {
        if (!this.isNew && this.email === v) {
            isvalid(true);
        }
        else {
            User.findOne({ email: v }, function (err, user) {
                isvalid(user == null);
            });
        }
    },
    message: 'Email already exists'
});

var User = mongoose.model('User', userSchema);

module.exports = User;