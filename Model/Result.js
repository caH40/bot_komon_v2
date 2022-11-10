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
	category: String,
	categoryCurrent: String,
	teamCurrent: String,
	isNeedCount: { type: Boolean, default: true },
	pointsStage: { type: Number, default: 0 },
	pointsSprint: { type: Number, default: 0 },
	pointsMountain: { type: Number, default: 0 },
	isUnderChecking: { type: String, default: false },
	comment: String,
	weightInGrams: Number,
	heightInCentimeters: Number,
	avgHeartRate: Number,
	gender: String,
	imageSrc: String,
});

export const Result = model('Result', resultSchema);
