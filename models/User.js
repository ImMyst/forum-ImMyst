const Sequelize = require('sequelize');

function defineUser(db) {

  const User = db.define('user', {
          email: { type: Sequelize.STRING },
          username: { type: Sequelize.STRING },
          password: { type: Sequelize.STRING }
  });

  User.associate = ({ Question, Comment }) => {
        User.hasMany(Question);
        User.hasMany(Comment);
  };
  return User;
}

module.exports = defineUser;
