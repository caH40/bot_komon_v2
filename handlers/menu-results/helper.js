import {
	resultSeriesGeneralKeyboard,
	resultStageCatKeyboard,
	resultStagesKeyboard,
} from '../../keyboard/keyboard.js';
import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';

export async function resultStages(ctx, cbqData) {
	try {
		const seriesId = cbqData.slice(14);
		const { name } = await Series.findOne({ _id: seriesId });
		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		return await ctx.editMessageText(
			`<b>📝 Результаты этапов ${name}.</b>`,
			resultStagesKeyboard(stagesDB)
		);
	} catch (error) {
		console.log(error);
	}
}

export async function resultStage(ctx, cbqData) {
	try {
		const stageId = cbqData.slice(6);
		const { number, seriesId } = await Stage.findOne({ _id: stageId });
		const { name } = await Series.findOne({ _id: seriesId });

		return await ctx.editMessageText(
			`<b>📝 Результаты этапа №${number} ${name}.</b>`,
			resultStageCatKeyboard(stageId)
		);
	} catch (error) {
		console.log(error);
	}
}
export async function resultGeneral(ctx, cbqData) {
	try {
		const _id = cbqData.slice(11);
		const { name } = await Series.findOne({ _id });

		return await ctx.editMessageText(
			`<b>👑 Генеральный зачет серии ${name}.</b>`,
			resultSeriesGeneralKeyboard(_id)
		);
	} catch (error) {
		console.log(error);
	}
}
