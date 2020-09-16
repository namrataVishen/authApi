// require('dotenv').config()
const mongoose = require("mongoose");
const passport = require("passport");
const User = mongoose.model("User");
const Token = mongoose.model("Token");
const jwt = require('jsonwebtoken');
const redis_client = require('../connections/redis_connect');
const {generateRefreshToken} = require('../config/jwtHelper')

module.exports.register = (req, res, next) => {
  var user = new User();
  try{
    user.fullName = req.body.fullName;
    user.password = req.body.password;
  }
  catch(err){
    res.status(500).send({"msg":"internal server error"})
  }
  user.save((err, doc) => {
    if (!err) res.send(doc);
    else {
      if (err.code == 11000)
        res.status(422).send(["Duplicate entry found."]);
      else return next(err);
    }
  });
};
module.exports.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {
    // error from passport middleware
    if (err) return res.status(400).json(err);
    // registered user
    else if (user) {
      let refreshToken = generateRefreshToken(user._id);
      redis_client.set(user._id.toString(), refreshToken, (err, reply) => {
        if(err) {
          console.log(`Refresh Token Set Error ${err}`);
          return res
                .status(500)
                .send({ auth: false, message: "Internal Server Error." });
        }
        console.log(`Token added successfully !!`)
      });
      return res.status(200).json({ "token": user.generateJwt(),"refresh_token": refreshToken });
    }// unknown user or wrong password
    else return res.status(404).json(info);
  })(req, res);
};
module.exports.refreshToken = (req, res, next) => {
  if ('authorization' in req.headers)
    var refreshToken = req.headers['authorization'].split(' ')[2];
  if (!refreshToken)
    return res.status(403).send({ auth: false, message: 'No refresh token provided.' });
  else {
    console.log(refreshToken);
    jwt.verify(refreshToken, process.env.REFRESH_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(403).send({ auth: false, message: 'Token authentication failed.' });
        else {
          console.log(typeof(decoded._id), decoded._id);
          redis_client.get(decoded._id, (err, value) => {
            if(err){
              return res
                .status(500)
                .send({ auth: false, message: "Internal Server Error." });
            }
            else if (!value ) {
              return res
                .status(403)
                .send({ auth: false, message: "Token authentication failed." });
            } else {
              console.log(value)
              const newToken = jwt.sign(
                { _id: decoded._id },
                process.env.JWT_SECRET
              );
              return res.status(200).send({ token: newToken });
            }
          });
        }
      }
    )
  }
}
module.exports.logout = (req, res, next) => {
  redis_client.del(req._id, (err, response) => {
    if(err){
      res.status(500).send({"msg":"Internal server error"})
    }
    else if(response === 1 || response === 0){
      res.status(200).send({"msg":"user logged out successfully"})
    }
  })
};