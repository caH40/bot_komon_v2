import { mainMenuKeyboard } from './keyboard.js';

export async function mainMenu(ctx) {
	try {
		return await ctx.editMessageText(
			`❗<b>Главное меню. Выбор основных функций.</b>❗`,
			await mainMenuKeyboard(ctx)
		);
	} catch (error) {
		console.log(error);
	}
}
