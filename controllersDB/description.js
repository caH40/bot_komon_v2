import { Team } from '../Model/Team.js';

export async function descriptionUpdate(userTelegramId, text) {
	try {
		const teamsDB = await Team.find().populate('riders.rider');

		const _id = teamsDB.find(team => team.riders[0].rider.telegramId === userTelegramId)?._id;

		if (!_id) console.log('не нашел команду для изменения описания');

		return await Team.findOneAndUpdate({ _id }, { $set: { description: text } });
	} catch (error) {
		console.log(error);
	}
}
