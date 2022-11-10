export async function help(ctx) {
	try {
		await ctx.reply(
			`/main - главное меню 👈\n/start - стартовое приветствие ❗\n/help - доступные команды ❓\n/click - количество кликов за день 🛎`
		);
		await ctx.deleteMessage();
	} catch (error) {
		console.log(error);
	}
}
