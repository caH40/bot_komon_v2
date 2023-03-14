import prk from 'mongoose';
const { Schema, model } = prk;

const userConfirmSchema = new Schema({
	userId: { type: String, unique: true, required: true },
	date: { type: Number, required: true },
	activationToken: { type: String, required: true },
	email: { type: String, required: true },
});

export const UserConfirm = model('UserConfirm', userConfirmSchema);
