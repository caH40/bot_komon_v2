import pkg from 'mongoose';
const { Schema, model } = pkg;

const clickSchema = new Schema({
	user: { type: Object, unique: true, required: true },
	clicks: { type: Number, default: 0 },
	clicksPerDay: {
		type: Array,
		default: [{ date: new Date().getTime(), clicks: 0 }],
	},
});

export const Click = model('Click', clickSchema);
