const mongoose = require('mongoose');
const { weighingDbSchema } = require('../schemas');

module.exports = mongoose.model('weighings', weighingDbSchema);
