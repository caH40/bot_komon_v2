import { Markup } from 'telegraf';
import { verifyRoot, verifyAdmin } from '../../modules/verify-user.js';

export async function mainBtn(ctx) {
	try {
		const isAdmin = await verifyAdmin(ctx);
		const isRoot = await verifyRoot(ctx);
		return [
			[Markup.button.callback('Результаты заездов 🏆', 'm_1_')],
			[Markup.button.callback('Расписание заездов 📅', 'm_2_')],
			[Markup.button.callback('Личный кабинет 🔑', 'm_3_')],
			[Markup.button.callback('Полезная информация ⚠️', 'm_4_')],
			isAdmin || isRoot ? [Markup.button.callback('Админ кабинет 🛠️', 'm_5_')] : [],
		];
	} catch (error) {
		console.log(error);
	}
}
