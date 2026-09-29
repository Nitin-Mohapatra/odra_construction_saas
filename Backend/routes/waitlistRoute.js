const express = require('express');
const router = express.Router();

const { joinWaitlist, getWaitlist, deleteWaitlistEntry } = require('../controllers/waitlistController');
const { authen } = require('../middleware/tokenValidatorsMiddleware');
const { validateRoles } = require('../middleware/roles');

// Public: join waitlist
router.post('/', joinWaitlist);

// Admin-only: get all waitlist entries
router.get('/', authen, validateRoles(['admin']), getWaitlist);

// Admin-only: remove a specific entry
router.delete('/:id', authen, validateRoles(['admin']), deleteWaitlistEntry);

module.exports = router;
