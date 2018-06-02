const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const Sequelize = require('sequelize');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const db = new Sequelize('project_web','user','root',{
    host: 'localhost',
    dialect: 'mysql'
});

const COOKIE_SECRET = 'C\'est bon les cookies';

const User = db.define('user', {
    username : { type: Sequelize.STRING },
    email : { type: Sequelize.STRING },
    password : { type: Sequelize.STRING },
    role : { type: Sequelize.ENUM('ADMIN', 'USER' ), defaultValue: 'USER' }
});

const Question = db.define('question', {
    title: { type : Sequelize.STRING},
    content: { type: Sequelize.STRING},
    resolvedAt: { type: Sequelize.DATE}

});

const Comment = db.define('comment', {
    content: { type: Sequelize.STRING }
});

Question.hasMany(Comment);
Comment.belongsTo(Question);

User.hasMany(Comment);
Comment.belongsTo(User);

User.hasMany(Question);
Question.belongsTo(User);

db.sync().then(r => {
}).catch(e => {
    console.error(e);
});

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded());

passport.use(new LocalStrategy((username, password, done) => {
    User
        .findOne({
            where: {username, password}
        }).then(function (user) {
        if (user) {
            return done(null, user)
        } else {
            return done(null, false, {
                message: 'Error!'
            });
        }
    })

        .catch(done);
}));


passport.serializeUser((user, cookieBuilder) => {
    cookieBuilder(null, user.email);
});

passport.deserializeUser((email, callback) => {

    User.findOne({
        where : { email }
    }).then(r => {
        if(r) return callback(null, r);
        else return callback(new Error("No corresponding with a user's cookie"));
    });
});

app.use(cookieParser(COOKIE_SECRET));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.get('/list-question',(req,res) => {
    Question
        .sync()
        .then(() => {
            Question
                .findAll({include:[{model: Comment,include:[User]}, User ]})
                .then((questions) => {
                    res.render( 'list-question', { questions, user : req.user});
                })
        })

});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/list-question',
        failureRedirect: '/login'
    })
);

app.get('/register',(req,res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, email, password} = req.body;
    User
        .sync()
        .then(() => {return User.count()})
        .then((count) =>
        { let role = 'USER'
            if (count == 0){
            role = 'ADMIN'
            }
            User.create({ username, email, password, role})
        })
        .then(() => res.redirect('/login'));
});


app.get('/add-question',(req,res) => {
    res.render('add-question');
});

app.post('/add-question', (req, res) => {
    const { title, content } = req.body;
    Question
        .sync()
        .then(() => Question.create({ title, content, userId: req.user.id }))
        .then(() => res.redirect('/list-question'));
});


app.get('/question/:questionId', (req, res) => {
    const { title, content } = req.body;
    Question
        .sync()
        .then(() => Question.findOne({where: {id: req.params.questionId} , include:[{model: Comment,include:[User]}, User ]}))
        .then((question) => res.render('question', {question, user: req.user}));
});

app.post('/question/:questionId/resolved', (req, res) => {
    Question
        .sync()
        .then(() => Question.update({ resolvedAt: new Date()}, {where: {id: req.params.questionId}}))
        .then(()=> res.redirect('/question/'+ req.params.questionId));
});

app.post('/question/:questionId/dropped', (req, res) => {
    Question
        .sync()
        .then(() => Question.destroy( {where: {id: req.params.questionId}}))
        .then(()=> res.redirect('/list-question'));
});


app.get('/question/:questionId/edit-question', (req, res) => {
    const { title, content } = req.body;
    Question
        .sync()
        .then(() => Question.findOne({where: {id: req.params.questionId}, include: [User] }))
        .then((question) => res.render('edit-question', {question, user: req.user}));
});

app.post('/question/:questionId/edit-question', (req, res) => {
    const { title, content } = req.body;
    Question
        .sync()
        .then(() => Question.update({title, content },{where: {id: req.params.questionId}}))
        .then((question) => res.redirect('/question/'+ req.params.questionId));
});

app.post('/comment/:questionId', (req, res) => {
    const { content } = req.body;
    Comment
        .sync()
        .then(() => Comment.create({ content, questionId: req.params.questionId, userId: req.user.id }))
        .then(() => res.redirect('/question/'+ req.params.questionId));
});

app.get('/comment/:questionId/edit-comment', (req, res) => {
    const { title, content } = req.body;
    Comment
        .sync()
        .then(() => Comment.findOne({where: {id: req.params.questionId}, include: [User] }))
        .then((comment) => res.render('edit-comment', {comment,user: req.user}));
});
app.post('/comment/:commentId/edit-comment', (req, res) => {
    const { content } = req.body;
    Comment
        .sync()
        .then(() => Comment.update({ content }, {where: {id: req.params.commentId}}))
        .then(() => Comment.findOne({where: {id: req.params.commentId}}))
        .then((comment) =>
        { console.log(comment);
            res.redirect('/question/'+ comment.questionId)});
});

app.listen(3000);
