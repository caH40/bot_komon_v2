import { clearCharts } from '../../keyboard/keyboard.js';
import { mainMenu } from '../../keyboard/main-menu.js';
import { generateView } from '../generate/schedule.js';

export async function posting(ctx, stagesDB, title) {
	try {
		await mainMenu(ctx);
		await ctx
			.replyWithHTML(generateView(stagesDB, title), {
				disable_web_page_preview: true,
				...clearCharts,
			})
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return;
	} catch (error) {
		console.log(error);
	}
}
