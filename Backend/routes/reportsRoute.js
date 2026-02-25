const express = require('express');
const router = express.Router();
const {validateRoles} = require("../middleware/roles");
const {authen} = require("../middleware/tokenValidatorsMiddleware");
const reportController = require("../controllers/reportControllers");

// create report by site engineer
router.post('/',authen,validateRoles('site engineer'),reportController.createReport);

router.post('/:reportId/review', authen, validateRoles('manager'), reportController.reviewReport);

// get report by id
router.get('/:id',authen,validateRoles('manager'),reportController.getReportById);

module.exports = router;
