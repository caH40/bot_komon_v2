import mongoose from 'mongoose';
import pkg from 'mongoose';

const { Schema, model } = pkg;

const resultSchema = new Schema({
	stageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stage' },
	riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
	zwiftRiderId: { type: Number },
	name: String,
	placeAbsolute: Number,
	wattPerKg: Number,
	watt: Number,
	time: Number,
	penalty: { powerUp: { type: Number, default: 0 } },
	isDisqualification: { type: Boolean, default: false },
	isDidNotFinish: { type: Boolean, default: false },
	category: String,
	categoryCurrent: String,
	teamCurrent: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
	isNeedCount: { type: Boolean, default: true },
	pointsStage: { type: Number, default: 0 },
	pointsStageOldW: { type: Number },
	pointsSprint: [
		{
			stageNumber: { type: Number },
			sprint: { type: Number },
			place: { type: String },
			points: { type: Number, default: 0 },
			_id: false,
		},
	],
	pointsMountain: [
		{
			stageNumber: { type: Number },
			mountain: { type: Number },
			place: { type: String },
			points: { type: Number, default: 0 },
			_id: false,
		},
	],
	isUnderChecking: { type: Boolean, default: false },
	comment: String,
	weightInGrams: Number,
	heightInCentimeters: Number,
	avgHeartRate: Number,
	gender: String,
	imageSrc: String,
});

export const Result = model('Result', resultSchema);
