const router = require('express').Router();
const { Question } = require('../models');

router.get('/questions/new', (req, res) => {
    res.render('admin/questions/new', { loggedInUser: req.user });
});

router.post('/questions/new', (req, res) => {
    const { title, description, resolved_at, user_id } = req.body;
    Question
        .create({ title, description, resolved_at user_id: req.user.id })
        .then(() => {
            res.redirect('/');
        });
});

router.get('/questions/:questionId', (req, res) => {
    Question
        .findById(req.params.questionId)
        .then((question) => {
            res.render('admin/questions/question', { question, loggedInUser: req.user });
        });
});

router.post('/questions/:questionId', (req, res) => {
    const { title, description, resolved_at, user_id } = req.body;
    Question
        .update({ title, description, resolved_at, user_id }, { where: { id: req.params.questionId } })
        .then(() => {
            res.redirect(`/questions/${req.params.questionId}`);
        });
});

module.exports = router;
