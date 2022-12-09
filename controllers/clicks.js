import { getChartClicks } from '../charts/clicks.js';
import { clearCharts } from '../keyboard/keyboard.js';
import { Click } from '../Model/Click.js';

export async function getClicks(ctx) {
	try {
		if (!ctx.session.data) {
			ctx.session.data = {};
			ctx.session.data.messagesIdForDelete = [];
		}
		await ctx.deleteMessage(ctx.message.message_id).catch(e => true);

		const clicksDB = await Click.find();

		const millisecondsInDay = 84000000;

		let day = new Date().setHours(0, 0, 0, 0);
		let labels = [];

		for (let i = 0; i < 20; i++) {
			labels.push(new Date(day).setHours(0, 0, 0, 0));
			day -= millisecondsInDay;
		}
		const data = [];
		// labels = labels.reverse();

		labels.forEach(day => {
			let clicksInDay = 0;
			clicksDB.forEach(user => {
				user.clicksPerDay.forEach(clicks => {
					if (day === clicks.date) {
						clicksInDay += clicks.clicks;
					}
				});
			});
			data.push(clicksInDay);
		});

		let label = 'Количество кликов за день';

		labels.forEach(
			(day, index) => (day = labels[index] = new Date(day).toLocaleDateString()?.slice(0, 5))
		);

		const base64Image = await getChartClicks(label, labels, data);
		await sendMessage(ctx, base64Image);
	} catch (error) {
		console.log(error);
	}
}

async function sendMessage(ctx, base64Image) {
	try {
		var base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
		await ctx
			.replyWithPhoto(
				{
					source: Buffer.from(base64Data, 'base64'),
				},
				clearCharts
			)
			.then(message => ctx.session.data?.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
}
