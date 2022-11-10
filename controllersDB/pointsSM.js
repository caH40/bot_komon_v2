import { Result } from '../Model/Result.js';

export async function pointsSprinterToDB(ctx, points, stageId) {
	try {
		points.forEach(async rider => {
			const resultDB = await Result.findOneAndUpdate(
				{ stageId, zwiftRiderId: rider.zwiftRiderId },
				{ $set: { pointsSprint: rider.points } },
				{ returnDocument: 'after' }
			);
			if (!resultDB)
				return await ctx.reply(`Ошибка при сохранении спринтерских очков ${rider.zwiftRiderId}`);
			await ctx
				.reply(
					`Обновлены спринтерские очки у ${resultDB.name}, установленно ${resultDB.pointsSprint}`
				)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		});
	} catch (error) {
		console.log(error);
	}
}

export async function pointsMountainToDB(ctx, points, stageId) {
	try {
		points.forEach(async rider => {
			const resultDB = await Result.findOneAndUpdate(
				{ stageId, zwiftRiderId: rider.zwiftRiderId },
				{ $set: { pointsMountain: rider.points } },
				{ returnDocument: 'after' }
			);
			if (!resultDB)
				return await ctx.reply(`Ошибка при сохранении горных очков ${rider.zwiftRiderId}`);

			await ctx
				.reply(`Обновлены горные очки у ${resultDB.name}, установленно ${resultDB.pointsMountain}`)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		});
	} catch (error) {
		console.log(error);
	}
}
