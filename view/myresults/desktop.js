import { clearCharts } from '../../keyboard/keyboard.js';
import { viewDesktop } from '../generate/my-results.js';

export async function myResultsViewDes(ctx, myResults, title) {
	try {
		await ctx
			.replyWithHTML('<pre>' + viewDesktop(myResults, title) + '</pre>', clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return;
	} catch (error) {
		console.log(error);
	}
}
