const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expired) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET); // <- Verifica que no sea undefined
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expired,
  });
};
