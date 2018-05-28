const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { Question, Comment, User } = require('../models');

router.get('/home', (req, res) => {
    Question
            res.render('activity');
        });


router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }

    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.post('/login', (req, res) => {
    const { fullname, username, password } = req.body;
    bcrypt
        .hash(password, 12)
        .then((hash) => {
            User
                .create({ fullname, username, password: hash })
                .then((user) => {
                    req.login(user, () => res.redirect('/'));
                });
        });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/questions/:questionId', (req, res) => {
    Question
        .findById(req.params.questionId, {
            include: [
                User,
                {
                    model: Comment,
                    include: [User]
                }
            ]
        })
        .then((question) => {
            res.render('question', { question, loggedInUser: req.user });
        });
});

router.post('/questions/:questionId', (req, res) => {
    const { content } = req.body;
    Comment
        .create({
            content,
            userId: req.user.id,
            questionId: req.params.questionId
        })
        .then(() => {
            res.redirect(`/questions/${req.params.questionId}`);
        });
});

router.get('/profile/:userId', (req, res) => {
    User
        .findById(req.params.userId, { include: [Question] })
        .then((user) => {
            res.render('profile', { user, loggedInUser: req.user });
        });
});

module.exports = router;
