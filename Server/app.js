const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const socketHandler = require("./sockets/socketHandler.js");

const { Server } = require("socket.io");

const bodyparser = require("body-parser");
const sequelize = require("./util/database");

app.use(cors());
app.use(bodyparser.json({ extended: false }));
const userrouter = require("./routes/users");
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://fullstack-emotions-chat.web.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(userrouter);
socketHandler(io);

sequelize.sync();
// sequelize.sync({ force: true });

//app.listen(4000); // we are not using app.listen cause it will create its own server
//that will run on port 4000,so we have two servers, but we need a server that we fed in to socket,
// in this server protocol is upgraded to websocket. if we use app.listen its server running without websocket protcol
const PORT = process.env.PORT || 4000;
server.listen(PORT);
