import { Markup } from 'telegraf';
import { Rider } from '../../Model/Rider.js';
import { verifyRoot, verifyAdmin } from '../../modules/verify-user.js';

export async function accountButtons(ctx) {
	try {
		const isAdmin = await verifyAdmin(ctx);
		const isRoot = await verifyRoot(ctx);
		const telegramId = ctx.update.callback_query.from.id;
		const riderDB = await Rider.findOne({ telegramId });

		return [
			[Markup.button.callback('Мои результаты 🏅', 'm_3_1_E')],
			riderDB
				? [Markup.button.callback('Обновить данные регистрации 🔄', 'account_registration')]
				: [Markup.button.callback('Регистрация 🆔', 'account_registration')],
			[Markup.button.callback('Команда 🤝', 'm_3_2_')],
			riderDB
				? [
						Markup.button.webApp(
							'Настройки ⚙️',
							`${process.env.SERVER}/settings/notice/${telegramId}`
						),
				  ]
				: [],
			riderDB ? [Markup.button.webApp('Обратная связь 💬', `${process.env.SERVER}/feedback/`)] : [],
			isAdmin || isRoot ? [Markup.button.callback('Админ пароль 🗝️', 'm_3_6_E')] : [],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		];
	} catch (error) {
		console.log(error);
	}
}
