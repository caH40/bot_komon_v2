import { Scenes } from 'telegraf';

import { getTelegramId } from './telegramid.js';
import textJson from '../../locales/ru.json' assert { type: 'json' };
import { finalMessageTeamCr } from '../../locales/template.js';
import { validationDescription, validationName } from './validation.js';
import { registrationToDB } from '../../controllersDB/team-save.js';

import { sendMessageAdmin } from './message.js';

export function firstSceneCreateTeam() {
	try {
		const t = textJson.scenes.teamCreate;
		const firstScene = new Scenes.BaseScene('firstSceneCreateTeam');
		firstScene.enter(async ctx => {
			ctx.session.data.teamCreate = {};
			ctx.session.data.teamCreate.counter = 0;
			getTelegramId(ctx);
			const nameTg = ctx.session.data.teamCreate.first_name;
			await ctx.replyWithHTML(t.first.welcome1 + nameTg + t.first.welcome2);
			await ctx.replyWithHTML(t.first.question);
		});
		firstScene.command('/quit', async ctx => {
			await ctx.reply(t.quit);
			return await ctx.scene.leave();
		});
		firstScene.on('message', async ctx => {
			ctx.session.data.teamCreate.counter++;
			const isManyAttempts = await attempts(ctx, ctx.session.data.teamCreate.counter);
			if (isManyAttempts) return await ctx.scene.leave();

			const text = ctx.message.text;
			ctx.session.data.messagesIdForDelete.push(ctx.message.message_id);
			const isValid = validationName(text);
			if (isValid) {
				ctx.session.data.teamCreate.name = text;
				return ctx.scene.enter('secondSceneCreateTeam');
			}
			await ctx.reply(t.first.wrong);
		});
		return firstScene;
	} catch (error) {
		console.log(error);
	}
}

export function secondSceneCreateTeam() {
	try {
		const t = textJson.scenes.teamCreate;
		let counter = 0;
		const secondScene = new Scenes.BaseScene('secondSceneCreateTeam');
		secondScene.enter(async ctx => {
			ctx.session.data.teamCreate.counter = 0;
			await ctx.replyWithHTML(t.second.question);
		});
		secondScene.command('/quit', async ctx => {
			await ctx.reply(t.quit);
			return await ctx.scene.leave();
		});
		secondScene.command('save', async ctx => {
			const response = await registrationToDB(ctx.session.data.teamCreate);
			if (response) {
				await ctx.reply(t.second.successfulDB);
				await sendMessageAdmin(ctx);
			} else {
				await ctx.reply(t.second.wrongDB);
			}
			return await ctx.scene.leave();
		});
		secondScene.command('repeat', async ctx => await ctx.scene.enter('firstSceneCreateTeam'));
		secondScene.command('quit', async ctx => await ctx.scene.leave());
		secondScene.on('message', async ctx => {
			ctx.session.data.teamCreate.counter++;
			const isManyAttempts = await attempts(ctx, ctx.session.data.teamCreate.counter);
			if (isManyAttempts) return await ctx.scene.leave();

			const text = ctx.message.text;
			const isValid = validationDescription(text);
			if (isValid) {
				ctx.session.data.teamCreate.description = text;
				return await ctx.replyWithHTML(finalMessageTeamCr(ctx));
			}
			await ctx.reply(t.second.wrong);
		});
		return secondScene;
	} catch (error) {
		console.log(error);
	}
}

async function attempts(ctx, counter) {
	try {
		const t = textJson.scenes.teamCreate;

		if (counter > 3) {
			return await ctx.reply(t.attempts);
		}
	} catch (error) {
		console.log(error);
	}
}
