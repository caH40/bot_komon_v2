import { Team } from '../Model/Team.js';

export async function postTeamLogo(userTelegramId, fileId, logoBase64) {
	try {
		const teamsDB = await Team.find().populate('riders.rider');

		const _id = teamsDB.find(team => team.riders[0].rider.telegramId === userTelegramId)?._id;
		if (!_id) console.log('не нашел команду для изменения логотипа');

		return await Team.findOneAndUpdate({ _id }, { $set: { logoUrl: fileId, logoBase64 } });
	} catch (error) {
		console.log(error);
	}
}
