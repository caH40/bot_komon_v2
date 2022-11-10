import { Result } from '../Model/Result.js';
import { Stage } from '../Model/Stage.js';

export async function updateTeamName(seriesId) {
	try {
		const stagesDB = await Stage.find({ seriesId, hasResults: true });
		// при обновлении названий команд в результате необходимо проверять, находится ли в команде на данный момент райдер и не вышел ни он из неё
		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({
				stageId: stagesDB[i]._id,
				riderId: { $ne: undefined },
			}).populate({ path: 'riderId', populate: 'teamId' });

			for (let j = 0; j < resultsDB.length; j++) {
				await Result.findOneAndUpdate(
					{ _id: resultsDB[j]._id },
					{ $set: { teamCurrent: resultsDB[j].riderId.teamId?.name } }
				);
			}
		}
	} catch (error) {
		console.log(error);
	}
}
