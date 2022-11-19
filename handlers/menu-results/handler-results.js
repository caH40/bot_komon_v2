import { resultsViewStage } from '../../view/stage/stage.js';
import { resultStage, resultStages } from './helper.js';

export async function handlerResults(ctx, cbqData) {
	try {
		if (!(cbqData.includes('result_') || cbqData.includes('stage_'))) return;

		if (cbqData.includes('result_Stages_')) return await resultStages(ctx, cbqData);
		if (cbqData.includes('stage_')) return await resultStage(ctx, cbqData);
		if (cbqData.includes('result_Stage_')) return await resultsViewStage(ctx, cbqData);
	} catch (error) {
		console.log(error);
	}
}
