import { clearCharts } from '../../keyboard/keyboard.js';
import { mainMenu } from '../../keyboard/main-menu.js';
import { viewDesktop } from '../generate/schedule.js';

export async function scheduleViewDes(ctx, stagesDB, title) {
	try {
		await mainMenu(ctx);
		await ctx
			.replyWithHTML('<pre>' + viewDesktop(stagesDB, title) + '</pre>', clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return;
	} catch (error) {
		console.log(error);
	}
}
