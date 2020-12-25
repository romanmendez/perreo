require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function createToken(user) {
  console.log(user.id, SECRET_KEY);
  return jwt.sign({ userId: user.id }, SECRET_KEY);
}

function getTokenPayload(token) {
  const validToken = jwt.verify(token, SECRET_KEY);
  if (!validToken) throw new Error("Invalid token");
  return validToken;
}

function getUserId(auth) {
  const token = auth.replace("Bearer ", "");
  console.log(token);
  if (!token) throw new Error("No token found");

  const { userId } = getTokenPayload(token);
  console.log(userId);
  return userId;
}

module.exports = { createToken, getUserId };
