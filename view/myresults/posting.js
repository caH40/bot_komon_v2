import { clearCharts } from '../../keyboard/keyboard.js';
import { generateView } from '../generate/my-results.js';

export async function posting(ctx, myResults, title) {
	try {
		await ctx
			.replyWithHTML(`<b>${title}</b>\n${generateView(myResults)}`, clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return;
	} catch (error) {
		console.log(error);
	}
}
