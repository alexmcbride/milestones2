var express = require('express');
var router = express.Router();
var User = require('../models/user');
var authorize = require('../utils/authorize');

/* GET users listing. */
router.get('/', authorize(), function (req, res) {
    User.find(function (err, user) {
        res.render('users/index', { user: req.userManager.user() });
    });
});

router.post('/', authorize(), function (req, res) {
    User.findById(req.userManager.userId(), function (err, user) {
        user.username = req.body.username;
        user.email = req.body.email;
        user.save(function (err) {
            if (err) {
                res.render('users/index', { user: user, errors: err.errors });
            }
            else {
                req.userManager.login(user);
                res.flashMessages.add('User details edited', 'success');
                res.redirect('/users');
            }
        });
    });
});

/* GET Log user in. */
router.get('/login', function (req, res, next) {
    res.render('users/login', { email: '' });
});

/* POST Log user in. */
router.post('/login', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        var error = function () {
            res.render('users/login', {
                email: req.body.email,
                error: 'Email or password is incorrect'
            });
        };

        if (!user) {
            return error();
        }

        req.userManager.auth(user, req.body.password, function (err, result) {
            if (err) {
                return console.log(err);
            }

            if (result) {
                req.userManager.login(user);
                res.flashMessages.add('You are logged in', 'success');
                res.redirect('/');
            }
            else {
                error();
            }
        });
    });
});

/* GET Register user. */
router.get('/register', function (req, res) {
    res.render('users/register', { user: new User() });
});

/* POST Register user. */
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
            res.flashMessages.add('You have successfully registered', 'success');
            res.redirect('/users/login');
        }
    });
});

/* GET Log user out. */
router.get('/logout', authorize(), function (req, res) {
    res.render('users/logout');
});

/* POST Log user out. */
router.post('/logout', authorize(), function (req, res) {
    req.userManager.logout();
    res.flashMessages.add('You are logged out', 'success');
    res.redirect('/');
});

module.exports = router;
