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
	categoryTour: String,
	gender: String,
	settings: {
		notice: {
			news: { type: Boolean, default: true },
			newRace: { type: Boolean, default: true },
			botInfo: { type: Boolean, default: true },
			training: { type: Boolean, default: true },
		},
	},
	username: { type: String, unique: true },
	password: String,
	role: { type: String },
	photoProfile: { type: String },
	email: { type: String, unique: true, required: true },
	emailConfirm: { type: Boolean, default: false },
});

export const Rider = model('Rider', riderSchema);
