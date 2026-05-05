const express = require('express');
const router = express.Router();
const {validateRoles} = require("../middleware/roles");
const {authen} = require("../middleware/tokenValidatorsMiddleware");
const reportController = require("../controllers/reportControllers");
const checkBusinessPlan = require("../middleware/checkBusinessPlan");

// create report by site engineer
router.post('/',authen,checkBusinessPlan,validateRoles('site engineer'),reportController.createReport);

router.post('/:reportId/review', authen, checkBusinessPlan,validateRoles('manager'), reportController.reviewReport);

// ai summary
router.post('/:reportId/ai-summary',
    authen,
    checkBusinessPlan,
    validateRoles('manager'),
    reportController.generateAISummary
);

// get report by id
router.get('/:id',authen,checkBusinessPlan,validateRoles('manager'),reportController.getReportById);

module.exports = router;
