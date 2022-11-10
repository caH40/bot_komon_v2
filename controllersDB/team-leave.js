import { mainMenu } from '../keyboard/main-menu.js';
import { Rider } from '../Model/Rider.js';
import { Team } from '../Model/Team.js';

export async function teamLeaveDB(ctx, cbqData) {
	try {
		const riderId = cbqData.slice(23);

		const capitan = await Team.findOne({ 'riders.0.rider': riderId });
		if (capitan)
			return await ctx
				.reply(
					'Вы не можете выйти из состава команды, так как являетесь её создателем и капитаном.'
				)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		//если не известен элемент в массиве
		const teamDB = await Team.findOneAndUpdate(
			{ riders: { $elemMatch: { rider: riderId } } },
			{ $set: { 'riders.$.dateLeave': new Date().getTime() } }
		);
		if (!teamDB)
			return await ctx.reply(
				'Произошла непредвиденная ошибка, ваши данные не найдены в команде в БД'
			);

		const response = await Rider.findOneAndUpdate(
			{ _id: riderId },
			{ $unset: { teamId: 1 } },
			{ returnDocument: 'after' }
		);

		if (!response.teamId)
			await ctx
				.reply('Вы вышли из состава команды!')
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return await mainMenu(ctx);
	} catch (error) {
		console.log(error);
	}
}
