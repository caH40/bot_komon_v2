export function getTelegramId(ctx) {
	try {
		if (ctx.update.callback_query) {
			ctx.session.data.passwordAdmin.telegramUsername =
				ctx.update.callback_query.message.chat.username;
			ctx.session.data.passwordAdmin.telegramId = ctx.update.callback_query.message.chat.id;
			ctx.session.data.passwordAdmin.first_name = ctx.update.callback_query.message.chat.first_name;
		} else {
			ctx.session.data.passwordAdmin.telegramUsername = ctx.message.from.username;
			ctx.session.data.passwordAdmin.telegramId = ctx.message.from.id;
			ctx.session.data.passwordAdmin.first_name = ctx.message.from.first_name;
		}
		return;
	} catch (error) {
		console.log(error);
	}
}
