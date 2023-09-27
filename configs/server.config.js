'use strict';
require('dotenv').config()

module.exports = {
    PORT : process.env.PORT || 3001,
    SECRET : "my-secret"
}