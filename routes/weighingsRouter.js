const weighingsRouter = require("express").Router();

const { authService, validationBody } = require('../middlewares');
const { weighingsController } = require("../controller");
const { weighingJoiSchema } = require("../schemas");

weighingsRouter.use(authService);

weighingsRouter.get("/", weighingsController.getWeighings);
weighingsRouter.post('/', weighingsController.addWeighing);

module.exports = weighingsRouter;
