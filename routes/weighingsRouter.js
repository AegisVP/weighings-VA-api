const weighingsRouter = require("express").Router();

const { authService } = require("../middlewares");
const { weighingsController } = require("../controller");

weighingsRouter.use(authService);

weighingsRouter.get("/", weighingsController.getWeighings);
weighingsRouter.post("/", weighingsController.addWeighing);

module.exports = weighingsRouter;
