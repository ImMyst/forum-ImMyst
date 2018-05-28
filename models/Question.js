const Sequelize = require('sequelize');

function defineQuestion(db) {

  const Question = db.define('questions', {
          title : { type: Sequelize.STRING},
          description : { type: Sequelize.STRING },
          user_id : { type: Sequelize.INTEGER },
          resolved_at : { type: Sequelize.DATE }
        }, {

            getterMethods: {
            excerpt() {
                return this.content.substr(0, 20) + '...';
            }
        }
    });
    Question.associate = ({ User, Comment }) => {
        Question.belongsTo(User);
        Question.hasMany(Comment);
    };
    return Question;
}

module.exports = defineQuestion;
