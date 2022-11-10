import mongoose from 'mongoose';
import pkg from 'mongoose';

const { Schema, model } = pkg;

const stageSchema = new Schema({
	seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
	number: Number,
	type: String,
	dateStart: Number,
	timeStart: Number,
	world: String,
	route: String,
	distance: String,
	ascent: String,
	laps: String,
	link: String,
	registeredRider: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rider' }],
	protocol: { type: String },
	hasResults: { type: Boolean, hasResults: false },
});

export const Stage = model('Stage', stageSchema);
