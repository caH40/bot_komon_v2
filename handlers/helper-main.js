import { Markup } from 'telegraf';
import { scheduleBtn } from '../keyboard/button/schedule-btn.js';
import { accountKeyboard } from '../keyboard/keyboard.js';
import { Rider } from '../Model/Rider.js';

export async function getSchedule(ctx) {
	try {
		return await ctx.editMessageText(
			'<b>📅 Расписание серий и отдельных заездов.</b>',
			await scheduleBtn()
		);
	} catch (error) {
		console.log(error);
	}
}

export async function account(ctx) {
	try {
		const userId = ctx.update.callback_query.from.id;
		const riderDB = await Rider.findOne({ telegramId: userId });

		let name = '';

		if (riderDB) {
			const gender = riderDB.gender === 'мужской' ? `🧔‍♂️` : `👩`;
			name = `${gender}  <i>${riderDB.lastName} ${riderDB.firstName}</i>`;
		}

		return await ctx.editMessageText(
			`<b>🔑 Личный кабинет.</b>\n${name}`,
			await accountKeyboard(ctx)
		);
	} catch (error) {
		console.log(error);
	}
}

export async function handlerStatistics(ctx) {
	try {
		return await ctx.editMessageText('<b>📊 Статистика по заездам</b>', {
			...Markup.inlineKeyboard([
				[Markup.button.webApp('Riders 🤸🏽‍♂️', `${process.env.SERVER}/statistics/riders/`)],
				[Markup.button.webApp('Stages 🏁', `${process.env.SERVER}/statistics/stages/`)],
				[Markup.button.callback('Главное меню ❗️', 'main')],
			]),
			parse_mode: 'html',
		});
	} catch (error) {
		console.log(error);
	}
}
export async function passwordForAdmin(ctx) {
	try {
		await ctx.scene.enter('passwordForAdmin');
	} catch (error) {
		console.log(error);
	}
}
