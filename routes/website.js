const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { Question, Comment, User } = require('../models');

const Question = db.define('questions', {
        title : { type: Sequelize.STRING},
        description : { type: Sequelize.STRING },
        user_id : { type: Sequelize.INTEGER },
        resolved_at : { type: Sequelize.DATE }
      });

router.get('/', (req, res) => {
    Question
        .sync()
        .then(()=> {
          return Question.findAll();
        })
        .then((questions) => {
            res.render('activity', { questions });
        });
});


 router.post('/api/post/question', (req, res) => {
     const { title, description, user_id, resolved_at } = req.body;
     Question
         .sync()
         .then(() => Question.create({ title, description, user_id, resolved_at }))
         .then(() => res.redirect('/'))
 });


 router.get('/', (req, res) => {
     Comment
         .sync()
         .then(()=> {
           return Comment.findAll();
         })
         .then((comments) => {
             res.render('activity', { comments });
         });
 });


  router.post('/api/post/comment', (req, res) => {
      const { question_id, content, user_id } = req.body;
      Comment
          .sync()
          .then(() => Comment.create({ question_id, content, user_id }))
          .then(() => res.redirect('/'))
  });
