import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';

export async function filterResults(seriesId) {
	try {
		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		let results = [];
		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find(
				{ stageId: stagesDB[i]._id, teamCurrent: { $ne: null } },

				{
					zwiftRiderId: true,
					name: true,
					pointsStage: true,
					pointsStage: true,
					teamCurrent: true,
					pointsStageOldW: true,
					imageSrc: true,
				}
			)
				.populate({ path: 'stageId', select: 'number' })
				.populate({ path: 'teamCurrent', select: ['name', 'riders'] });
			// .populate({ path: 'teamCurrent', select: ['name', 'riders', 'logoBase64'] });

			results.push(...resultsDB);
		}

		return results;
	} catch (error) {
		console.log(error);
	}
}
