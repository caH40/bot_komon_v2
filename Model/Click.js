import pkg from 'mongoose';
const { Schema, model } = pkg;

const clickSchema = new Schema({
	user: { type: Object, unique: true, required: true },
	clicksPerDay: [{ date: Number, clicks: Number, _id: false }],
});

export const Click = model('Click', clickSchema);
