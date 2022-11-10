import { Result } from '../Model/Result.js';
import { Stage } from '../Model/Stage.js';

export async function getResultsSeries(seriesId) {
	try {
		const stagesDB = await Stage.find({ seriesId, hasResults: true });
		const results = [];
		for (let i = 0; i < stagesDB.length; i++) {
			const resultsDB = await Result.find({ stageId: stagesDB[i]._id });
			results.push(...resultsDB);
		}

		return results;
	} catch (error) {
		console.log(error);
	}
}
