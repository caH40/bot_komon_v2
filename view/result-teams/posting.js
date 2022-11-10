import { clearCharts } from '../../keyboard/keyboard.js';
import { generateView } from '../generate/result-teams.js';

export async function posting(ctx, results, series) {
	try {
		for (let i = 0; i < results.length; i++) {
			await ctx
				.replyWithHTML(generateView(results[i], series), clearCharts)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		}

		return true;
	} catch (error) {
		console.log(error);
	}
}
