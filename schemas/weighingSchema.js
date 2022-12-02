const { Schema } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const sourcesList = [
  'Елеватор',
  'Склад(бригада)',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09-1',
  '09-2',
  '09-3',
  '10',
  '11',
  '12',
  '13',
  '14',
  '14-1',
  '15-1',
  '15-2',
  '16',
  '17',
  '18',
  '19',
  '20',
  '26',
  '30',
  '31',
  '32',
  '33',
  '36',
];

const destinationsList = ['Елеватор', 'Склад(бригада)', 'Отгрузка'];

const weighingsDbSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    auto: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Auto',
        required: true,
      },
      driver: {
        type: String,
        required: true,
      },
    },
    crop: {
      name: {
        type: String,
        required: true,
      },
      source: {
        type: String,
        enum: sourcesList,
        required: true,
      },
      destination: {
        type: String,
        enum: destinationsList,
        required: true,
      },
    },
    weighing: {
      tare: {
        type: Number,
        required: true,
      },
      brutto: {
        type: Number,
        required: true,
      },
      netto: {
        type: Number,
        required: true,
      },
      isIncoming: {
        type: Boolean,
        default: true,
        required: true,
      },
    },
    harvesters: [
      {
        name: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
        },
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const addSchema = Joi.object({
  date: Joi.date().required(),
  auto: {
    id: Joi.objectId().required(),
    driver: Joi.string().required(),
  },
  crop: {
    name: Joi.string().required(),
    source: Joi.string()
      .valid(...sourcesList)
      .required(),
    destination: Joi.string()
      .valid(...destinationsList)
      .required(),
  },
  weighing: {
    tare: Joi.number().required(),
    brutto: Joi.number().required(),
    netto: Joi.number(),
    isIncoming: Joi.boolean().required(),
  },
  harvesters: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      weight: Joi.number(),
    })
  ),
});

module.exports = {
  weighingsDbSchema,
  weighingsJoiSchema: {
    addSchema,
  },
};
