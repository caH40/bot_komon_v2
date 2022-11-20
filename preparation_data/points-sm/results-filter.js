import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';

export async function filterResults(series) {
	try {
		const seriesId = series.slice(1);

		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		let results = [];
		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({
				stageId: stagesDB[i]._id,
				'pointsMountain.mountain': 1,
			}).populate('stageId');
			results.push(...resultsDB);
		}

		return results;
	} catch (error) {
		console.log(error);
	}
}
