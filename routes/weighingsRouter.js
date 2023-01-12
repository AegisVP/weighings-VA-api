const weighingsRouter = require('express').Router();

const { validationBody } = require('../middlewares');
const { weighingsController } = require('../controller');
const { weighingJoiSchema } = require('../schemas');
const { tryCatchWrapper } = require('../utils');

weighingsRouter.get('/', tryCatchWrapper(weighingsController.getWeighings));
weighingsRouter.post('/', validationBody(weighingJoiSchema.addSchema), tryCatchWrapper(weighingsController.addWeighing));

module.exports = weighingsRouter;
