import { Click } from '../Model/Click.js';

export async function getClicks(ctx) {
	try {
		// let clicksTotalDB = await Click.aggregate([
		// 	{
		// 		$group: {
		// 			_id: 'totalClicks',
		// 			clicks: { $sum: '$clicks' },
		// 		},
		// 	},
		// ]);

		const clicksDB = await Click.find();

		const millisecondsInDay = 84000000;

		let dayForTotal = new Date().getTime() - millisecondsInDay;
		const total = {};

		for (let i = 0; i < 7; i++) {
			total[new Date(dayForTotal).toLocaleDateString()] = 0;
			dayForTotal -= millisecondsInDay;
		}

		clicksDB.forEach(user => {
			user.clicksPerDay.forEach(clicks => {
				let day = new Date().getTime() - millisecondsInDay;
				for (let i = 0; i < 7; i++) {
					if (new Date(clicks.date).toLocaleDateString() === new Date(day).toLocaleDateString()) {
						total[new Date(clicks.date).toLocaleDateString()] += clicks.clicks;
					}
					day -= millisecondsInDay;
				}
			});
		});

		let totalStr = 'Количество кликов в меню:\n';
		const keys = Object.keys(total);

		keys.forEach(day => {
			let emoji = '🧊';
			if (total[day] > 99 && total[day] < 199) emoji = '🌡️';
			if (total[day] > 199 && total[day] < 300) emoji = '🔥';
			if (total[day] > 299) emoji = '🧨';
			totalStr += `${emoji} ${day} - <u>${total[day] ? total[day] : 0}</u>;\n`;
		});
		await ctx.replyWithHTML(totalStr);
	} catch (error) {
		console.log(error);
	}
}
