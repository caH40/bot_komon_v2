import { Click } from '../Model/Click.js';

export async function countClicksPerDay() {
	try {
		const clicksDb = await Click.find();

		clicksDb.forEach(async user => {
			const total = user.clicks;

			const currentDay = {};
			currentDay.date = new Date().getTime();

			let prePeriod = 0;
			user.clicksPerDay.forEach(day => (prePeriod += day.clicks));

			currentDay.clicks = total - prePeriod;

			await Click.findOneAndUpdate({ _id: user._id }, { $push: { clicksPerDay: currentDay } });
		});
	} catch (error) {
		console.log(error);
	}
}
