const weighingsRouter = require('express').Router();

const { authService, validationBody } = require('../middlewares');
const { weighingsController } = require('../controller');
const { weighingsJoiSchema } = require('../schemas');
const { tryCatchWrapper } = require('../utils');

weighingsRouter.use(authService);

weighingsRouter.get('/', tryCatchWrapper(weighingsController.getWeighings));
weighingsRouter.post('/', validationBody(weighingsJoiSchema.addSchema), tryCatchWrapper(weighingsController.addWeighing));

module.exports = weighingsRouter;
