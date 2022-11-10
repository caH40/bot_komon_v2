import { Scenes } from 'telegraf';
import { pointsMountainToDB } from '../../controllersDB/pointsSM.js';
import { mountainKeyboard } from '../../keyboard/keyboard-points.js';

import { Result } from '../../Model/Result.js';

export function pointsMountainScene() {
	try {
		const firstScene = new Scenes.BaseScene('pointsMountain');

		firstScene.enter(async ctx => {
			try {
				ctx.session.data.pointsFixed = [];
				let resultsDB = await Result.find({ stageId: ctx.session.data.stageId });
				if (resultsDB.length === 0) {
					await ctx
						.reply('Не найдены результаты серии')
						.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
					return await ctx.scene.leave();
				}

				resultsDB = resultsDB.sort((a, b) => {
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
					if (a.name === b.name) return 0;
				});
				ctx.session.data.resultsDB = resultsDB;

				for (let i = 0; i < resultsDB.length; i++) {
					if (resultsDB[i])
						await ctx
							.reply(resultsDB[i].name, mountainKeyboard(resultsDB[i]))
							.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
				}
			} catch (error) {
				console.log;
			}
		});

		firstScene.command('/quit', async ctx => {
			await ctx.reply('Выход из сцены!');
			return await ctx.scene.leave();
		});

		firstScene.on('callback_query', async ctx => {
			try {
				for (let index = 0; index < ctx.session.data.messagesIdForDelete.length; index++) {
					await ctx.deleteMessage(ctx.session.data.messagesIdForDelete[index]);
				}
				ctx.session.data.messagesIdForDelete = [];
				const qbcData = ctx.update.callback_query.data;

				if (qbcData.includes('zwiftRiderId')) {
					let resultsDB = ctx.session.data.resultsDB;
					const pointsFixed = JSON.parse(qbcData);

					ctx.session.data.pointsFixed.push(pointsFixed);
					let isClicked = {};

					ctx.session.data.pointsFixed.forEach(pointFixed => {
						isClicked[pointFixed.points] = true;
					});

					if (ctx.session.data.pointsFixed.length === 2) {
						await pointsMountainToDB(ctx, ctx.session.data.pointsFixed, ctx.session.data.stageId);
						return await ctx.scene.leave();
					}
					ctx.session.data.pointsFixed.forEach(pointFixed => {
						resultsDB = resultsDB.filter(
							result => result.zwiftRiderId?.toString() !== pointFixed.zwiftRiderId.toString()
						);
					});

					for (let i = 0; i < resultsDB.length; i++) {
						if (resultsDB[i])
							await ctx
								.reply(resultsDB[i].name, mountainKeyboard(resultsDB[i], isClicked))
								.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
					}
				}
			} catch (error) {
				console.log;
			}
		});
		firstScene.on('message', async ctx => await ctx.reply('Введите /quit'));
		return firstScene;
	} catch (error) {
		console.log(error);
	}
}
