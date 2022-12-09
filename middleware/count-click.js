import { Click } from '../Model/Click.js';

export async function countClick(ctx, next) {
	try {
		if (ctx.update.callback_query) {
			const user = ctx.update.callback_query.from;

			if (user.id == process.env.DEVELOPER_ID) return next();

			const today = new Date().setHours(0, 0, 0, 0);

			const click = await Click.findOneAndUpdate(
				{ 'user.id': user.id, 'clicksPerDay.date': today },
				{ $inc: { 'clicksPerDay.$[elem].clicks': 1 } },
				{ arrayFilters: [{ 'elem.date': today }] }
			);

			if (!click) {
				const updatedRider = await Click.findOneAndUpdate(
					{ 'user.id': user.id },
					{ $push: { clicksPerDay: { date: today, clicks: 1 } } },
					{ returnDocument: 'after' }
				);
				if (!updatedRider) {
					const click = Click({
						user,

						clicksPerDay: [{ date: new Date().setHours(0, 0, 0, 0), clicks: 1 }],
					});
					await click.save();
				}
			}
		}

		return next();
	} catch (error) {
		console.log(error);
	}
}
