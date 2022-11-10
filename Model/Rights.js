import pkg from 'mongoose';

const { Schema, model } = pkg;

const rightsSchema = new Schema({
	unique: { type: String, unique: true, default: '0' },
	root: [Number],
	admin: [Number],
	moderator: [Number],
});

export const Rights = model('Rights', rightsSchema);
