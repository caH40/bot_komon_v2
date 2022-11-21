import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';

export async function filterResults(series) {
	try {
		const seriesId = series.slice(1);
		const type = series.slice(0, 1);
		const stringForType = { S: 'pointsSprint.sprint', M: 'pointsMountain.mountain' };

		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		let results = [];
		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({
				stageId: stagesDB[i]._id,
				[stringForType[type]]: 1,
			}).populate('stageId');
			results.push(...resultsDB);
		}

		return results;
	} catch (error) {
		console.log(error);
	}
}
