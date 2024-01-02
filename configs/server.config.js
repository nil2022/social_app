require('dotenv').config()

module.exports = {
    PORT : process.env.PORT || 3001,
    SECRET : process.env.SECRET_KEY
}