const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Messages = sequelize.define("messages", {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  chat_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sender_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Messages;
