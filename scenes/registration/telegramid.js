export function getTelegramId(ctx) {
	try {
		if (ctx.update.callback_query) {
			ctx.session.data.account.telegramUsername = ctx.update.callback_query.message.chat.username;
			ctx.session.data.account.telegramId = ctx.update.callback_query.message.chat.id;
			ctx.session.data.account.first_name = ctx.update.callback_query.message.chat.first_name;
		} else {
			ctx.session.data.account.telegramUsername = ctx.message.from.username;
			ctx.session.data.account.telegramId = ctx.message.from.id;
			ctx.session.data.account.first_name = ctx.message.from.first_name;
		}
		return;
	} catch (error) {
		console.log(error);
	}
}
