import { seriesBtn } from '../../keyboard/button/schedule-btn.js';
import { mobVsDesKeyboard, resultSeriesKeyboard } from '../../keyboard/keyboard.js';
import { beingDeveloped } from '../../modules/beingDeveloped.js';
import { resultsSeriesGeneral } from '../../view/series_general/series-general.js';
import { resultsViewStage } from '../../view/stage/stage.js';
import { resultGeneral, resultStage, resultStages } from './helper.js';

export async function handlerResults(ctx, cbqData) {
	try {
		if (!(cbqData.includes('result_') || cbqData.includes('view_') || cbqData.includes('stage_')))
			return;

		if (cbqData.includes('view_')) {
			const queryData = cbqData.slice(5);
			return await ctx.editMessageText(
				'<b>👨‍💻 Выбор используемого устройства.</b>',
				mobVsDesKeyboard(queryData)
			);
		}

		// четвертый уровень меню
		if (cbqData.includes('result_Stages_')) return await resultStages(ctx, cbqData);

		if (cbqData.includes('stage_')) return await resultStage(ctx, cbqData);

		// результаты

		//необходимо искать сначала более длинный составной ключ
		// отриcовка таблиц

		if (cbqData.includes('result_Stage_')) return await resultsViewStage(ctx, cbqData);
	} catch (error) {
		console.log(error);
	}
}
