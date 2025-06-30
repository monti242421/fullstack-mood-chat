const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: {
              ca: fs.readFileSync(
                path.join(__dirname, "../certs/isrgrootx1.pem")
              ),
              rejectUnauthorized: true,
            },
          }
        : {},
    port: parseInt(process.env.DB_PORT),
    host: process.env.DB_HOST,
  }
);

module.exports = sequelize;

// this username root and password is the password of mysql server that mysql provided me on first installion, mysql workbench does not create server, it is just to connect the server. Here in my machine i am using my sql server, if databse is hosted on aws server they will give new creadentials. myswl database can be hosted on mysql server or aws server or on others.
