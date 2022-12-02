const { Schema } = require('mongoose');

const auto = new Schema({
  model: { type: String, required: true },
  licensePlate: { type: String, required: true },
});

const constants = new Schema({
  type: { type: String, required: true },
  data: [],
});

module.exports = { constants, auto };
