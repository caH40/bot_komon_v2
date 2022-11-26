import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';

export async function getPointsTeams(seriesId) {
	try {
		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		let results = [];
		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({ stageId: stagesDB[i]._id, teamCurrent: { $ne: null } })
				.populate('stageId')
				.populate('teamCurrent');
			results.push(...resultsDB);
		}
		console.log(results.length);
	} catch (error) {
		console.log(error);
	}
}
