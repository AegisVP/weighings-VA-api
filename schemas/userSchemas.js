const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { allConstants } = require('../utils');

const subscriptionTypes = allConstants.subscriptionsList;

const userDbSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    subscription: {
      type: String,
      enum: subscriptionTypes,
      default: subscriptionTypes[0],
    },
    token: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: '',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userDbSchema.method('cryptPassword', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).alphanum().required(),
  subscription: Joi.string().valid(...subscriptionTypes),
  token: Joi.string(),
  isVerified: Joi.boolean(),
  verificationToken: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const subscriptionSchema = Joi.object({
  email: Joi.string().email().required(),
  subscription: Joi.string().valid(...subscriptionTypes).required(),
});

module.exports = {
  userDbSchema,
  userJoiSchemas: {
    addSchema,
    loginSchema,
    subscriptionSchema,
  },
  subscriptionTypes,
};
