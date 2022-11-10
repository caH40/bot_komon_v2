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
