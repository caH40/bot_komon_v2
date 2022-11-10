import { descriptionKeyboard } from '../../keyboard/keyboard-desc.js';
import { ruleCatchUp, ruleCritRace, ruleSeries } from './helper.js';

export async function handlerDescription(ctx, cbqData) {
	try {
		if (cbqData === 'm_4_')
			return await ctx.editMessageText('<b>⚠️ Полезная информация!</b>', descriptionKeyboard());
		if (cbqData === 'm_4_2') return await ruleSeries(ctx);
		if (cbqData === 'm_4_3') return await ruleCritRace(ctx);
		if (cbqData === 'm_4_4') return await ruleCatchUp(ctx);
	} catch (error) {
		console.log(error);
	}
}
