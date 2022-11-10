import { clearCharts } from '../../keyboard/keyboard.js';
import { generateView } from '../generate/riders.js';

export async function posting(ctx, riders) {
	try {
		return await ctx
			.replyWithHTML(generateView(riders), clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
}
