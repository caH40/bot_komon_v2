import { handler } from '../handlers/handler.js';

export async function callbackQuery(ctx) {
	try {
		const cbqData = ctx.update.callback_query.data;
		//обработчики меню создания объявления о заезде(поста)
		await handler(ctx, cbqData);
	} catch (error) {
		console.log(error);
	}
}
