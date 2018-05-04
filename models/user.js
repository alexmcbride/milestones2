var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty']
    },
    email: {
        type: String,
        required: [true, 'Email cannot be empty']
    },
    password: String,
    joined: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.authenticate = function(password) {
    
};

var User = mongoose.model('User', userSchema);

module.exports = User;