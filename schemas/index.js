const { weighingsDbSchema, weighingsJoiSchema } = require('./weighingSchema');
const { userDbSchema, userJoiSchemas } = require('./userSchemas');

module.exports = { weighingsDbSchema, weighingsJoiSchema, userDbSchema, userJoiSchemas, constantsDbSchema: require('./constantsSchemas') };
