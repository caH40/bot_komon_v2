import mongoose from 'mongoose';
import pkg from 'mongoose';

const { Schema, model } = pkg;

const teamSchema = new Schema({
	name: { type: String, unique: true },
	riders: [
		{
			rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', required: true },
			dateJoin: { type: Number, required: true },
			dateLeave: Number,
			_id: false,
		},
	],
	description: String,
	groupName: String,
	link: String,
	isAllowed: { type: Boolean, default: false },
	requestRiders: { type: Array },
});

export const Team = model('Team', teamSchema);
