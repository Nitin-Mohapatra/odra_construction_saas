const express = require('express');
const tokenValidation = express.Router();
const {authen} = require('../middleware/tokenValidatorsMiddleware');
const {tokenHandler} = require('../controllers/tokenValidatorHandler');


tokenValidation.get('/me',authen,tokenHandler);
module.exports = tokenValidation;