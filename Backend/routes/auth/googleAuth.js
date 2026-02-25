const express = require('express');
const googleAuth = express.Router();
const { googleAuthHandler } = require("../../controllers/googleAuthController");    

googleAuth.post('/google', googleAuthHandler);
module.exports = {googleAuth};
