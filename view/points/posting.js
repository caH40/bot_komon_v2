import { clearCharts } from '../../keyboard/keyboard.js';
import { mainMenu } from '../../keyboard/main-menu.js';
import { generateView } from '../generate/points.js';

export async function posting(ctx, totalResult, typePoints, seriesName) {
	try {
		await mainMenu(ctx);
		let standings = '';

		if (typePoints === 'pointsMountain') {
			standings = `Горный зачет ⛰️`;
		} else if (typePoints === 'pointsSprint') {
			standings = `Спринтерский зачет ⚡`;
		}

		const title = `${seriesName}, ${standings}`;

		await ctx
			.replyWithHTML(`<b>${title}</b>\n${generateView(totalResult, typePoints)}`, clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return true;
	} catch (error) {
		console.log(error);
	}
}
