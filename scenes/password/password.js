import { Scenes } from 'telegraf';

import { savePassword } from '../../controllersDB/password-admin.js';
import textJson from '../../locales/ru.json' assert { type: 'json' };
import { getTelegramId } from './telegramid.js';
import { validationPassword } from './validation.js';

const t = textJson.scenes.passwordForAdmin;
export const passwordForAdminScene = new Scenes.BaseScene('passwordForAdmin');
passwordForAdminScene.enter(async ctx => {
	ctx.session.data.passwordAdmin = {};
	ctx.session.data.passwordAdmin.counter = 0;
	getTelegramId(ctx);
	const nameTg = ctx.session.data.passwordAdmin.first_name;
	await ctx.replyWithHTML(t.welcome1 + nameTg + t.welcome2);
	await ctx.replyWithHTML(t.question);
});

passwordForAdminScene.command('quit', async ctx => {
	await ctx.replyWithHTML(t.quit);
	return await ctx.scene.leave();
});

passwordForAdminScene.on('message', async ctx => {
	ctx.session.data.passwordAdmin.counter++;
	const isManyAttempts = await attempts(ctx, ctx.session.data.passwordAdmin.counter);
	if (isManyAttempts) return await ctx.scene.leave();

	const password = ctx.message.text;
	const isValid = validationPassword(password);
	if (isValid) {
		const savedPassword = await savePassword(ctx.session.data.passwordAdmin.telegramId, password);
		if (savedPassword?.response) {
			await ctx.replyWithHTML(savedPassword?.message);
			return await ctx.scene.leave();
		}
		await ctx.replyWithHTML(t.wrongDB);
		return await ctx.scene.leave();
	}
	await ctx.replyWithHTML(t.wrong);
});

async function attempts(ctx, counter) {
	try {
		if (counter > 3) {
			return await ctx.replyWithHTML(t.attempts);
		}
	} catch (e) {
		console.log(e);
	}
}
