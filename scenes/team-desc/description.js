import { Scenes } from 'telegraf';

import { getTelegramId } from './telegramid.js';
import textJson from '../../locales/ru.json' assert { type: 'json' };
import { validationDescription } from './validation.js';
import { descriptionUpdate } from '../../controllersDB/description.js';

export function teamDescriptionScene() {
	try {
		const t = textJson.scenes.teamDescription;
		const firstScene = new Scenes.BaseScene('teamDescription');

		firstScene.enter(async ctx => {
			ctx.session.data.teamDescription = {};
			ctx.session.data.teamDescription.counter = 0;
			getTelegramId(ctx);

			const nameTg = ctx.session.data.teamDescription.first_name;
			await ctx
				.replyWithHTML(t.first.welcome1 + nameTg + t.first.welcome2)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
			await ctx
				.replyWithHTML(t.first.question)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		});
		firstScene.command('/quit', async ctx => {
			await ctx.reply(t.quit);
			return await ctx.scene.leave();
		});
		firstScene.on('message', async ctx => {
			ctx.session.data.teamDescription.counter++;
			const isManyAttempts = await attempts(ctx, ctx.session.data.teamDescription.counter);
			if (isManyAttempts) return await ctx.scene.leave();

			const text = ctx.message.text;
			ctx.session.data.messagesIdForDelete.push(ctx.message.message_id);

			const isValid = validationDescription(text);
			if (isValid) {
				ctx.session.data.teamDescription.description = text;
				const response = await descriptionUpdate(ctx.session.data.teamDescription.telegramId, text);
				if (response)
					await ctx
						.reply(t.first.successfulDB)
						.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
				return ctx.scene.leave('teamDescription');
			}
			await ctx.reply(t.first.wrong);
		});
		return firstScene;
	} catch (error) {
		console.log(error);
	}
}

async function attempts(ctx, counter) {
	try {
		const t = textJson.scenes.teamDescription;

		if (counter > 3) {
			return await ctx.reply(t.attempts);
		}
	} catch (error) {
		console.log(error);
	}
}
