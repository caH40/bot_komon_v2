import { clearCharts } from '../../keyboard/keyboard.js';
import { viewDesktopTotal } from '../generate/stage-result-total.js';

import { viewDesktop } from '../generate/stage-result.js';
export async function resultsViewStageDes(ctx, charts, title, category) {
	try {
		if (category === 'T') {
			for (let i = 0; i < charts.length; i++) {
				await ctx
					.replyWithHTML(`<pre>${title}\n${viewDesktopTotal(charts[i])}</pre>`, clearCharts)
					.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
			}
			return true;
		}

		for (let i = 0; i < charts.length; i++) {
			await ctx
				.replyWithHTML(`<pre>${title}\n${viewDesktop(charts[i])}</pre>`, clearCharts)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		}
		return true;
	} catch (error) {
		console.log(error);
	}
}
