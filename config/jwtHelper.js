const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
  var token;
  if ('authorization' in req.headers)
    token = req.headers['authorization'].split(' ')[2];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  else {
    jwt.verify(token, process.env.REFRESH_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
        else {
          req._id = decoded._id;
          next();
        }
      }
    )
  }
}
module.exports.generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, process.env.REFRESH_SECRET);
};
