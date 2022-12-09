import pkg from 'mongoose';
const { Schema, model } = pkg;

const clickSchema = new Schema({
	_id: false,
	user: { type: Object, unique: true, required: true },
	clicksPerDay: [{ date: Number, clicks: Number }],
});

export const Click = model('Click', clickSchema);
