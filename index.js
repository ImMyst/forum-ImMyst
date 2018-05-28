const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const db = new Sequelize('project_web', 'user', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});


app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', 'public/views')
app.use(express.static('public'));

app.get('/question', (req, res) => {
    res.render('question');
});

const Question = db.define('questions', {
        title : { type: Sequelize.STRING},
        description : { type: Sequelize.STRING },
        user_id : { type: Sequelize.INTEGER },
        resolved_at : { type: Sequelize.DATE }
      });

app.get('/', (req, res) => {
    Question
        .sync()
        .then(()=> {
          return Question.findAll();
        })
        .then((questions) => {
            res.render('activity', { questions });
        });
});


 app.post('/api/post/question', (req, res) => {
     const { title, description, user_id, resolved_at } = req.body;
     Question
         .sync()
         .then(() => Question.create({ title, description, user_id, resolved_at }))
         .then(() => res.redirect('/'))
 });

 const Comment = db.define('comments', {
         question_id : { type: Sequelize.INTEGER},
         content : { type: Sequelize.STRING },
         user_id : { type: Sequelize.INTEGER }
       });

 app.get('/', (req, res) => {
     Comment
         .sync()
         .then(()=> {
           return Comment.findAll();
         })
         .then((comments) => {
             res.render('activity', { comments });
         });
 });


  app.post('/api/post/comment', (req, res) => {
      const { question_id, content, user_id } = req.body;
      Comment
          .sync()
          .then(() => Comment.create({ question_id, content, user_id }))
          .then(() => res.redirect('/'))
  });


app.listen(3000);
