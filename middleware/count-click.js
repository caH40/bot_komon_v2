import { Click } from '../Model/Click.js';

export async function countClick(ctx, next) {
	try {
		if (ctx.update.callback_query) {
			const user = ctx.update.callback_query.from;

			const click = await Click.findOneAndUpdate({ 'user.id': user.id }, { $inc: { clicks: 1 } });

			if (!click) {
				const click = Click({
					user,
					clicks: 1,
					dateStart: new Date().getTime(),
				});
				await click.save();
			}

			return next();
		}

		return next();
	} catch (error) {
		console.log(error);
	}
}
