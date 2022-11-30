const { requestError } = require('../utils');

module.exports = schema => {
  const func = async (req, _, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) return next(requestError(400, error.message, 'ValidationError'));

    return next();
  };

  return func;
};
