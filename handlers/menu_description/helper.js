import { googleDocsKeyboard } from '../../keyboard/keyboard-desc.js';
import { clearCharts } from '../../keyboard/keyboard.js';
import { Description } from '../../Model/Description.js';

export async function linksGoogleDocs(ctx) {
	try {
		return await ctx.editMessageText('📈 Результаты в GoogleDocs', googleDocsKeyboard());
	} catch (error) {
		console.log(error);
	}
}

export async function ruleSeries(ctx) {
	try {
		const descriptionDB = await Description.findOne({ name: 'Series' });
		await ctx
			.reply(descriptionDB.description, clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
}

export async function ruleCritRace(ctx) {
	try {
		const descriptionDB = await Description.findOne({ name: 'Crit' });
		await ctx
			.reply(descriptionDB.description, clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
}

export async function ruleCatchUp(ctx) {
	try {
		const descriptionDB = await Description.findOne({ name: 'CatchUp' });
		await ctx
			.reply(descriptionDB.description, clearCharts)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
}
