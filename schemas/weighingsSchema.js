const { Schema, SchemaTypes } = require("mongoose");

const weighingDbSchema = new Schema(
	{
		date: { type: SchemaTypes.Date, required: true },
		driverName: {
			type: String,
			required: true,
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
		},
		culture: {
			cultureName: {
				type: String,
				required: true,
			},
			fieldName: {
				type: String,
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
			netto: () => this.weighing.brutto - this.weighing.tare,
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
		versionKey: false,
		timestamps: true,
	}
);

module.exports = { weighingDbSchema };
