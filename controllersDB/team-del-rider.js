import { mainMenuKeyboard } from '../keyboard/keyboard.js';
import { Rider } from '../Model/Rider.js';
import { Team } from '../Model/Team.js';

export async function teamRemoveRiderDB(ctx, cbqData) {
	try {
		const riderId = cbqData.slice(12);

		const teamDB = await Team.findOneAndUpdate(
			{ riders: { $elemMatch: { rider: riderId } } },
			{ $set: { 'riders.$.dateLeave': new Date().getTime() } }
		);
		if (!teamDB)
			return await ctx.reply(
				'Произошла непредвиденная ошибка, ваши данные не найдены в команде в БД'
			);

		const riderDB = await Rider.findOneAndUpdate(
			{ _id: riderId },
			{ $unset: { teamId: 1 } },
			{ returnDocument: 'after' }
		);

		if (!riderDB.teamId)
			return await ctx
				.reply('Вы удалили райдера из состава команды!')
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return await ctx.reply(
			'Произошла непредвиденная ошибка, ваши данные не найдены в команде в БД'
		);
	} catch (error) {
		console.log(error);
	}
}
