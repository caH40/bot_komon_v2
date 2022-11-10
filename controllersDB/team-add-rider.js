import { Rider } from '../Model/Rider.js';
import { Team } from '../Model/Team.js';

export async function addRiderDB(ctx, candidateId) {
	try {
		const time = new Date().toLocaleString();

		const teamDB = await Team.findOneAndUpdate(
			{ requestRiders: candidateId },
			{
				$pull: { requestRiders: candidateId },
				$push: { riders: { rider: candidateId, dateJoin: new Date().getTime() } },
			}
		);

		const riderDB = await Rider.findOneAndUpdate(
			{ _id: candidateId },
			{ $set: { teamId: teamDB._id } },
			{ returnDocument: 'after' }
		);

		if (riderDB.teamId) {
			await ctx.telegram.sendMessage(
				riderDB.telegramId,
				`${time}. Ваша заявка на присоединение к команде "${teamDB.name}" одобрена.`
			);
			await ctx
				.reply(`Райдер ${riderDB.lastName} ${riderDB.firstName} присоединился к команде!`)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		} else {
			await ctx
				.retry(
					'Что то пошло не так, произошла ошибка! Попробуйте повторить операцию через некоторое время.'
				)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		}
	} catch (error) {
		console.log(error);
	}
}
export async function notAddRiderDB(ctx, candidateId) {
	try {
		const time = new Date().toLocaleString();

		const teamDB = await Team.findOneAndUpdate(
			{ requestRiders: candidateId },
			{ $pull: { requestRiders: candidateId } }
		);

		const riderDB = await Rider.findOne({ _id: candidateId });

		await ctx.telegram.sendMessage(
			riderDB.telegramId,
			`${time}. Ваша заявка на присоединение к команде "${teamDB.name}" отклонена.`
		);
		await ctx
			.reply(`Вы отклонили заявку райдера ${riderDB.lastName} ${riderDB.firstName}`)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
}
