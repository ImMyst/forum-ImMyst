const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { Question, Comment, User } = require('../models');

router.get('/add-question', (req, res) => {
    Question
            res.render('add-question');
        });

router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect('/addquestion');
    }

    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/register', (req, res) => {
    if (req.user) {
        return res.redirect('/login');
    }

    res.render('register');
});

router.post('/register', (req, res) => {
    const { email, username, password } = req.body;
    bcrypt
        .hash(password, 12)
        .then((hash) => {
            User
                .create({ email, username, password: hash })
                .then((user) => {
                    req.register(user, () => res.redirect('/login'));
                });
        });
});

// router.get('/addquestion', (req, res) => {
//     Question
//         .findById(req.params.questionId, {
//             include: [
//                 User,
//                 {
//                     model: Comment,
//                     include: [User]
//                 }
//             ]
//         })
//         .then((question) => {
//             res.render('addquestion', { question, loggedInUser: req.user });
//         });
// });

router.post('/addquestion', (req, res) => {
    Question
        .create({
              title,
              description,

        })
        .then((question) => {
            res.render('addquestion', { question, loggedInUser: req.user });
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
