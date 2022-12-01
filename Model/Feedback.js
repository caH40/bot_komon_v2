import mongoose from 'mongoose';
import pkg from 'mongoose';

const { Schema, model } = pkg;

const feedbackSchema = new Schema({
	telegramId: { type: Number, required: true },
	date: Number,
	text: { type: String, unique: true },
	isCompleted: Boolean,
});

export const Feedback = model('Feedback', feedbackSchema);
