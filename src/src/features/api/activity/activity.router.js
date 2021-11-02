const express = require('express');

const router = express.Router();

const authorization = require('../../../utils/middleware/authorization');
const activityController = require('./activity.controller');

router.get('/', authorization('activities:view'), activityController.listActivity);
router.get('/:activityId', authorization('activities:view'), activityController.getActivity);

module.exports = router;
