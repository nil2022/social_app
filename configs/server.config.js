'use strict';
require('dotenv').config()

const port = process.env.PORT || 3100;
const secret = "my-secret";

module.exports = {
    PORT : port,
    SECRET : secret
}