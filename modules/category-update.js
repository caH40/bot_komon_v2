import { adminCatRidersKeyboard } from '../keyboard/keyboard.js';
import { Result } from '../Model/Result.js';
import { Rider } from '../Model/Rider.js';

export async function updateCategoryDB(result, categoryCurrent) {
	try {
		const riderDB = await Rider.findOne({ zwiftId: result.zwiftId });
		//если аккаунт существует, то выход
		if (riderDB) return { category: riderDB.category };

		const riderZwiftIdDB = await Result.findOne({ zwiftRiderId: result.zwiftId });
		if (riderZwiftIdDB) return { category: riderZwiftIdDB.category };

		return { category: categoryCurrent };
	} catch (error) {
		console.log(error);
	}
}

export async function assignCategoryRiderFromStage(ctx, cbqData) {
	try {
		const stageId = cbqData.slice(11);

		const ridersDB = await Rider.find();
		//обновление riderId в результатах, если не было
		for (let i = 0; i < ridersDB.length; i++) {
			await Result.updateMany(
				{ $and: [{ zwiftRiderId: ridersDB[i].zwiftId }, { riderId: null }] },
				{ $set: { riderId: ridersDB[i]._id } }
			);
		}

		let message = '';
		const resultDB = await Result.find({ stageId });

		for (let i = 0; i < resultDB.length; i++) {
			if (resultDB.riderId) {
				let riderDB = await Rider.findOne({ _id: resultDB[i].riderId });
				if (riderDB.category < resultDB[i].category) {
					let resultsForUpdateDB = await Result.updateMany(
						{ riderId: resultDB[i].riderId },
						{ $set: { category: resultDB[i].category } }
					);
					let riderDB = await Rider.findOneAndUpdate(
						{ _id: resultDB[i].riderId },
						{ $set: { category: resultDB[i].category } }
					);
				}
			} else {
				const resultsDB = await Result.updateMany(
					{
						$and: [
							{ zwiftRiderId: resultDB[i].zwiftRiderId },
							{ category: { $gt: resultDB[i].categoryCurrent } },
						],
					},
					{ $set: { category: resultDB[i].categoryCurrent } },
					{ returnDocument: 'after' }
				);
			}
		}

		// message += `${riderUpdated.lastName} ${riderUpdated.firstName} новая группа ${riderUpdated.category}\n`;

		// await ctx.reply(message);
		await ctx.reply('Категории обновились');
	} catch (error) {
		console.log(error);
	}
}

export async function riderCategory(ctx, text) {
	try {
		try {
			const riders = [];
			const ridersDB = await Result.find({ name: { $regex: text } });

			for (let index = 0; index < ridersDB.length; index++) riders.push(ridersDB[index]);

			if (riders.length > 15)
				return await ctx.reply(
					'Нашлось слишком много райдеров, сузьте поиск, увеличьте количество букв.  Для выхода /quit'
				);
			if (riders.length === 0)
				return await ctx.reply(
					`Ничего не нашлось.\nВвод необходимо осуществлять на кириллице начиная с заглавной буквы. Для выхода /quit`
				);

			riders.forEach(async rider => {
				await ctx
					.reply(
						`
Name: <b>${rider.name}</b>
Текущая группа: <b>${rider.category ? rider.category : 'не присвоена'}</b>
<b>Выберите новую категорию райдеру:</b>`,
						adminCatRidersKeyboard(rider.zwiftRiderId)
					)
					.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
			});
			return await ctx.scene.leave();
		} catch (error) {
			console.log(error);
		}
	} catch (error) {
		console.log(error);
	}
}

export async function assignCatRider(ctx, cbqData) {
	try {
		const category = cbqData.slice(11, 12);
		const zwiftRiderId = cbqData.slice(13);

		const riderDB = await Rider.findOneAndUpdate({ zwiftId: zwiftRiderId }, { $set: { category } });
		const riderZwiftIdDB = await Result.updateMany(
			{ zwiftRiderId },
			{ $set: { category } },
			{ returnDocument: 'after' }
		);
		// if (!riderDB)
		// 	return await ctx.reply('Произошла непредвиденная ошибка при сохранении категории...');

		const title = `Вы изменили категорию на <b>"${category}"</b>`;

		await ctx
			.replyWithHTML(title)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return;
		// return await ctx.telegram.sendMessage(
		// 	riderDB.telegramId,
		// 	`Вам изменили категорию группы с  <b>"${
		// 		riderDB.category ? riderDB.category : 'не присвоена'
		// 	}"</b> на <b>"${category}"</b>`,
		// 	{ parse_mode: 'html' }
		// );
	} catch (error) {
		console.log(error);
	}
}
