const Sequelize = require('sequelize');

function defineComment(db) {

  const Comment = db.define('comments', {
          question_id : { type: Sequelize.INTEGER},
          content : { type: Sequelize.STRING },
          user_id : { type: Sequelize.INTEGER }
        }, {

            getterMethods: {
            excerpt() {
                return this.content.substr(0, 20) + '...';
            }
        }
    });
    Comment.associate = ({ User, Question }) => {
        Comment.belongsTo(User);
        Comment.belongsTo(Question);
    };
    return Comment;
}

module.exports = defineComment;
