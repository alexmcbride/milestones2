var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res) {
    User.find(function (err, users) {
        res.render('users/index', { users: users });
    });
});

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('users/login', { email: '' });
});

router.post('/login', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) console.log(err);

        var error = function () {
            res.render('users/login', { 
                email: req.body.email, 
                error: 'Email or password is incorrect'
             });
        };

        if (user) {
            user.auth(req.body.password, function (result) {
                if (result) {
                    user.login(req.session);
                    res.redirect('/');
                }
                else {
                    error();
                }
            });
        }
        else {
            error();
        }
    });
});

router.get('/register', function (req, res) {
    res.render('users/register', { user: new User() });
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
            res.render('users/register', { user: user, errors: err.errors });
        }
        else {
            res.redirect('/users/login');
        }
    });
});

router.post('/logout', function (req, res) {
    user.logout(req.session, function () {
        res.redirect('/');
    });
});

module.exports = router;
