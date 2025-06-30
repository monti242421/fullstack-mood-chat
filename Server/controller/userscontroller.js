const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}
const generateAccessToken = (id, username) => {
  return jwt.sign({ userid: id, username: username }, process.env.TOKEN_SECRET);
};

exports.login = async (req, res, next) => {
  try {
    //console.log(req.body)
    if (isStringInvalid(req.body.email) || isStringInvalid(req.body.password)) {
      return res.status(400).json({ err: "Bad Parameters, Missing Data" });
    }

    var result = await user.findAll({ where: { email: req.body.email } });
    if (result.length > 0) {
      bcrypt.compare(
        req.body.password,
        result[0].dataValues.password,
        (err, resultPass) => {
          if (err) {
            throw new Error("Something Went Wrong");
          }
          if (resultPass === true) {
            res.status(201).json({
              message: "Successfully logged in",
              token: generateAccessToken(
                result[0].dataValues.userId,
                result[0].dataValues.username
              ),
            });
          } else {
            return res.status(400).json({ err: "Incorrect Password" });
          }
        }
      );
    } else {
      return res.status(404).json({ err: "User doesnt exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    //console.log(req.body)

    if (
      isStringInvalid(req.body.name) ||
      isStringInvalid(req.body.email) ||
      isStringInvalid(req.body.password)
    ) {
      return res.status(400).json({ err: "Bad Parameters, Missing Data" });
    }

    const saltrounds = 10;
    bcrypt.hash(req.body.password, saltrounds, async (err, hash) => {
      try {
        console.log(err);
        await user.create({
          username: req.body.name,
          email: req.body.email,
          password: hash,
        });
        // console.log(result.dataValues)
        res.status(201).json({ message: "Successfully created new user" });
      } catch (error) {
        console.log(error.name);
        if (error.name == "SequelizeUniqueConstraintError")
          res.status(500).json({ err: "User already exists" });
      }
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};
