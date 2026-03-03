const express = require('express');
const router = express.Router();
const workersController = require("../controllers/workersController");
const {validateRoles} = require("../middleware/roles");
const {authen} = require("../middleware/tokenValidatorsMiddleware");
const checkBusinessPlan = require("../middleware/checkBusinessPlan");


// Create worker (Contractor only)
router.post('/', authen,checkBusinessPlan, validateRoles("manager"), workersController.createWorker);

// Get workers for a project
router.get('/:projectId', authen,checkBusinessPlan, validateRoles(["manager", "site engineer"]), workersController.getProjectWorkers);

// Get all workers
router.get('/', authen,checkBusinessPlan, validateRoles("manager"), workersController.getAllWorkers);

// Assign worker to project
router.post('/:workerId/assign', authen,checkBusinessPlan, validateRoles("manager"), workersController.assignWorkerToProject);

module.exports = router;

