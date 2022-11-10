export async function beingDeveloped(ctx) {
	try {
		await ctx
			.reply('В разработке...')
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		return true;
	} catch (error) {
		console.log(error);
	}
}
