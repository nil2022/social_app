require("dotenv").config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT || 3001,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};
