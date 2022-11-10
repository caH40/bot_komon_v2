import { clearCharts } from '../../keyboard/keyboard.js';
import { viewMobile } from '../generate/result-teams.js';

export async function resultTeamMob(ctx, results, series) {
	try {
		for (let i = 0; i < results.length; i++) {
			let title = `Командный зачет ${series}, "${results[i][0]?.category}"`;
			await ctx
				.replyWithHTML(`${title}\n${viewMobile(results[i])}`, clearCharts)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		}

		return true;
	} catch (error) {
		console.log(error);
	}
}
