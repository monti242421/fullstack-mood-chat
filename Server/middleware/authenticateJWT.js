const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  //console.log(token);

  if (!token) {
    return res.status(401).send({
      message: "No token Provided",
    });
  }
  try {
    //console.log(token);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded.userid;
    // console.log(req.user);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
