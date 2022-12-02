const { model } = require('mongoose');
const { constantsDbSchema } = require('../schemas');

module.exports = {
  Auto: model('auto', constantsDbSchema.auto),
  Constants: model('constants', constantsDbSchema.constants),
};
