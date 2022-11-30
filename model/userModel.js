const { model } = require('mongoose');
const { userDbSchema } = require('../schemas');

module.exports = model('user', userDbSchema);
