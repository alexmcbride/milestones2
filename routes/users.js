var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('users/login');
});

router.post('/login', function (req, res) {
    var user = User.find({email: req.body.email}, function(err, user) {
        if (user.authenticate(req.body.password)) {

        }
        else {
            res.render('users/login', {email: req.body.email, error: 'Email or password are incorrect'});
        }
    });
});

router.get('/register', function (req, res) {
    var user = new User();
    res.render('users/register', { user: user });
});

router.post('/register', function (req, res) {
    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    user.save(function (err) {
        if (err) {
            res.render('users/register', { user: user, errors: err.error });
        }
        else {
            res.redirect('/users/login');
        }
    });
});

module.exports = router;
