export async function filterMessage(ctx, next) {
	try {
		if (
			ctx.message?.chat.type === 'private' ||
			ctx.update.channel_post?.chat.id === +process.env.CHANNEL_ID
		)
			return next();
		if (ctx.update.callback_query?.message.chat.type === 'private') return next();
	} catch (error) {
		console.log(error);
	}
}
