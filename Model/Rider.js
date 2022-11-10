import mongoose from 'mongoose';
import pkg from 'mongoose';

const { Schema, model } = pkg;

const riderSchema = new Schema({
	teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
	firstName: String,
	lastName: String,
	firstNameZwift: String,
	lastNameZwift: String,
	telegramUsername: String,
	telegramId: { type: Number, unique: true },
	zwiftId: { type: Number, unique: true },
	cycleTrainer: String,
	zwiftPower: String,
	yearBirth: String,
	category: String,
	gender: String,
});

export const Rider = model('Rider', riderSchema);
