const constantsRouter = require('express').Router();

const { authService } = require('../middlewares');
const { constantsController } = require('../controller');
const { tryCatchWrapper } = require('../utils');

constantsRouter.use(authService);

constantsRouter.get('/autos', tryCatchWrapper(constantsController.getAutos));
constantsRouter.get('/subscriptions', tryCatchWrapper(constantsController.getSubscriptions));
constantsRouter.get('/drivers', tryCatchWrapper(constantsController.getDrivers));
constantsRouter.get('/harvesters', tryCatchWrapper(constantsController.getHarvesters));
constantsRouter.get('/sourcesList', tryCatchWrapper(constantsController.getSources));
constantsRouter.get('/destinationsList', tryCatchWrapper(constantsController.getDestinations));
constantsRouter.get('/crops', tryCatchWrapper(constantsController.getCrops));

module.exports = constantsRouter;
