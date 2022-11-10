import { mainMenuKeyboard } from '../keyboard/keyboard.js';

export async function mainMenu(ctx) {
	try {
		await ctx.deleteMessage();
		ctx.session.data = {};
		ctx.session.data.messagesIdForDelete = [];
		await ctx.replyWithHTML(
			`❗<b>Главное меню. Выбор основных функций.</b>❗`,
			await mainMenuKeyboard(ctx)
		);
	} catch (error) {
		console.log(error);
	}
}
