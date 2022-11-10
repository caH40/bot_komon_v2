import { Markup } from 'telegraf';
import { Rider } from '../../Model/Rider.js';

export async function accountButtons(ctx) {
	try {
		const userId = ctx.update.callback_query.from.id;
		const riderDB = await Rider.findOne({ telegramId: userId });

		return [
			[Markup.button.callback('Мои результаты 🏅', 'm_3_1_E')],
			riderDB
				? [Markup.button.callback('Обновить данные регистрации 🔄', 'account_registration')]
				: [Markup.button.callback('Регистрация 🆔', 'account_registration')],
			[Markup.button.callback('Команда 🤝', 'm_3_2_')],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		];
	} catch (error) {
		console.log(error);
	}
}
