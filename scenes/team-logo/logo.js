import axios from 'axios';
import { Scenes } from 'telegraf';

import { getTelegramId } from './telegramid.js';
import textJson from '../../locales/ru.json' assert { type: 'json' };
import { postTeamLogo } from '../../controllersDB/teamlogo.js';

const t = textJson.scenes.teamLogo;
export const sceneTeamLogo = new Scenes.BaseScene('teamLogo');
sceneTeamLogo.enter(async ctx => {
	try {
		ctx.session.data.teamLogo = {};
		ctx.session.data.teamLogo.counter = 0;
		getTelegramId(ctx);

		const nameTg = ctx.session.data.teamLogo.first_name;
		await ctx
			.replyWithHTML(t.first.welcome1 + nameTg + t.first.welcome2)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		await ctx
			.replyWithHTML(t.first.question)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
});

sceneTeamLogo.command('/quit', async ctx => {
	try {
		await ctx
			.reply(t.quit)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		return await ctx.scene.leave();
	} catch (error) {
		console.log(error);
	}
});

sceneTeamLogo.on('photo', async ctx => {
	try {
		const fileId = ctx.update.message.photo[1]?.file_id;

		const fileInTelegram = await ctx.telegram.getFile(fileId);
		const photoBuffer = await axios.get(
			`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileInTelegram.file_path}`,
			{ responseType: 'arraybuffer' }
		);
		const logoBase64 = Buffer.from(photoBuffer.data, 'binary').toString('base64');

		const userId = ctx.session.data.teamLogo.telegramId;
		const response = await postTeamLogo(userId, fileId, logoBase64);
		if (response) {
			await ctx
				.reply(t.first.successfulDB)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		} else {
			await ctx
				.reply(t.first.wrongUpdate)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		}
		return ctx.scene.leave('teamDescription');
	} catch (error) {
		console.log(error);
	}
});

sceneTeamLogo.on('message', async ctx => {
	try {
		ctx.session.data.teamLogo.counter++;
		const isManyAttempts = await attempts(ctx, ctx.session.data.teamLogo.counter);
		if (isManyAttempts) return await ctx.scene.leave();

		if (!ctx.update.message.photo) {
			await ctx.replyWithHTML(t.first.wrong);
		}
	} catch (error) {
		console.log(error);
	}
});

async function attempts(ctx, counter) {
	try {
		const t = textJson.scenes.teamLogo;

		if (counter > 3) {
			return await ctx.reply(t.attempts);
		}
	} catch (error) {
		console.log(error);
	}
}
