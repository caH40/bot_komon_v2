import {
	resultSeriesGeneralKeyboard,
	resultSeriesKeyboard,
	resultStageCatKeyboard,
	resultStagesKeyboard,
	resultTourGeneralKeyboard,
} from '../../keyboard/keyboard.js';
import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';
import { getEmojiSeason } from '../../utility/seasons.js';

export async function resultSeries(ctx, cbqData) {
	try {
		const seriesId = cbqData.slice(9);

		const { name, dateStart } = await Series.findOne({ _id: seriesId });
		return await ctx.editMessageText(
			`<b>🏆 Результаты заездов "${name}" ${getEmojiSeason(dateStart)}</b>`,
			await resultSeriesKeyboard(cbqData)
		);
	} catch (error) {
		console.log(error);
	}
}
export async function resultStages(ctx, cbqData) {
	try {
		const seriesId = cbqData.slice(14);
		const { name, dateStart } = await Series.findOne({ _id: seriesId });
		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		return await ctx.editMessageText(
			`<b>📝 Результаты этапов "${name}" ${getEmojiSeason(dateStart)}</b>`,
			resultStagesKeyboard(stagesDB, seriesId)
		);
	} catch (error) {
		console.log(error);
	}
}

export async function resultStage(ctx, cbqData) {
	try {
		const stageId = cbqData.slice(6);
		const { number, seriesId } = await Stage.findOne({ _id: stageId });
		const { name, dateStart } = await Series.findOne({ _id: seriesId });

		let quantityWomenCategory = 2;
		if (name === 'Autumn Race series 2022') quantityWomenCategory = 1;

		return await ctx.editMessageText(
			`<b>📝 Результаты этапа №${number} "${name}" ${getEmojiSeason(dateStart)}</b>`,
			resultStageCatKeyboard(stageId, seriesId, quantityWomenCategory)
		);
	} catch (error) {
		console.log(error);
	}
}
export async function resultGeneral(ctx, cbqData) {
	try {
		const _id = cbqData.slice(11);
		const { name, dateStart, type } = await Series.findOne({ _id });

		let quantityWomenCategory = 2;
		if (name === 'Autumn Race series 2022') quantityWomenCategory = 1;

		if (type === 'tour') {
			return await ctx.editMessageText(
				`<b>👑 Генеральный зачет "${name}" ${getEmojiSeason(dateStart)}</b>`,
				resultTourGeneralKeyboard(_id)
			);
		} else {
			return await ctx.editMessageText(
				`<b>👑 Генеральный зачет серии "${name}" ${getEmojiSeason(dateStart)}</b>`,
				resultSeriesGeneralKeyboard(_id, quantityWomenCategory)
			);
		}
	} catch (error) {
		console.log(error);
	}
}
