import { clearCharts } from '../../keyboard/keyboard.js';
import { mainMenu } from '../../keyboard/main-menu.js';
import { generateView } from '../generate/general.js';

export async function posting(ctx, resultsGeneral, category, name) {
	try {
		await mainMenu(ctx);

		const title = `${name}, Ген.зачет,"${category}"`;

		await ctx
			.replyWithHTML(`<b>${title}</b>\n${generateView(resultsGeneral)}`, clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return true;
	} catch (error) {
		console.log(error);
	}
}
