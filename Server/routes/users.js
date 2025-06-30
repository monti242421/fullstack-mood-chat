const express = require("express");

const router = express.Router();
const userscontroller = require("../controller/userscontroller");
const jwtVerification = require("../middleware/authenticateJWT");

router.post("/login", userscontroller.login);

router.post("/signup", userscontroller.signup);

router.get("/api/verify-token", jwtVerification.authenticate, (req, res) => {
  res.send({ message: "Token is valid", user: req.user });
});

module.exports = router;
