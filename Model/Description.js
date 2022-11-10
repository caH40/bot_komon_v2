import pkg from 'mongoose';
const { Schema, model } = pkg;

const descriptionSchema = new Schema({
	name: { type: String, unique: true, required: true },
	description: { type: String },
});

export const Description = model('Description', descriptionSchema);
