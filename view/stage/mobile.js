import { clearCharts } from '../../keyboard/keyboard.js';
import { viewMobileTotal } from '../generate/stage-result-total.js';
import { viewMobile } from '../generate/stage-result.js';

export async function resultsViewStageMob(ctx, results, title, category) {
	try {
		if (category === 'T') {
			await ctx
				.replyWithHTML(`<b>${title}</b>\n${viewMobileTotal(results)}`, clearCharts)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

			return true;
		}

		await ctx
			.replyWithHTML(`<b>${title}</b>\n${viewMobile(results)}`, clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return true;
	} catch (error) {
		console.log(error);
	}
}
