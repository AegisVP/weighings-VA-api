const mongoose = require('mongoose');
const { weighingsDbSchema } = require('../schemas');

module.exports = mongoose.model('weighings', weighingsDbSchema);
