import pkg from 'mongoose';
const { Schema, model } = pkg;

const seriesSchema = new Schema({
	name: { type: String, unique: true, required: true },
	dateStart: Number,
	description: String,
	type: String,
	organizer: String,
	hasGeneral: Boolean,
	hasTeams: Boolean,
});

export const Series = model('Series', seriesSchema);
