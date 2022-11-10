export async function filterMessage(ctx, next) {
	try {
		if (ctx.message?.chat.type === 'private') return next();
		if (ctx.update.callback_query?.message.chat.type === 'private') return next();
	} catch (error) {
		console.log(error);
	}
}
