const { Schema } = require('mongoose');
const Joi = require('joi');

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

const destinationsList = ['Склад(бригада)', 'Елеватор', 'Отгрузка'];

const weighingDbSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    auto: {
      model: {
        type: String,
        required: true,
      },
      licensePlate: {
        type: String,
        required: true,
      },
      driverName: {
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
      brutto: {
        type: Number,
        required: true,
      },
      tare: {
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
        fullName: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

weighingDbSchema.virtual('weighing.netto').get(function () {
  return this.weighing.brutto - this.weighing.tare;
});

const addSchema = Joi.object({
  date: Joi.date().required(),
  auto: {
    model: Joi.string().required(),
    licensePlate: Joi.string().required(),
    driverName: Joi.string().required(),
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
    brutto: Joi.number().required(),
    tare: Joi.number().required(),
    isIncoming: Joi.boolean().required(),
  },
  harvesters: Joi.array().items(
    Joi.object({
      fullName: Joi.string().required(),
      weight: Joi.number().required(),
    })
  ),
});

module.exports = {
  weighingDbSchema,
  weighingJoiSchema: {
    addSchema,
  },
};
