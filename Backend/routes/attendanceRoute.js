const express = require('express');
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const workersController = require("../controllers/workersController");
const {validateRoles} = require("../middleware/roles");
const {authen} = require("../middleware/tokenValidatorsMiddleware");
const checkBusinessPlan = require("../middleware/checkBusinessPlan");

// Get workers for a project (used by attendance page)
router.get('/workers/:projectId', authen,checkBusinessPlan, validateRoles("site engineer"), workersController.getProjectWorkers);

// Mark attendance
router.post('/mark', authen,checkBusinessPlan, validateRoles("site engineer"), attendanceController.markAttendance);

// Get attendance for a specific project and date
router.get('/:projectId/:date', authen,checkBusinessPlan, validateRoles(["site engineer", "manager"]), attendanceController.getAttendance);
module.exports = router;

