import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';

export async function getStatStages() {
	try {
		const resultsDB = await Result.find({ isDidNotFinish: false });
		const stagesDB = await Stage.find({ hasResults: true }).populate('seriesId');

		let statistics = [];
		stagesDB.forEach(stageElm => {
			const stage = {};
			const resultsStage = resultsDB.filter(
				result => String(result.stageId) === String(stageElm._id)
			);

			const leaderResult = resultsStage?.sort((a, b) => a.time - b.time)[0];
			stage._id = resultsStage[0]?._id;
			stage.series = stageElm.seriesId.name;
			stage.stageId = stageElm._id;
			stage.number = stageElm.number;
			stage.route = stageElm.route;
			stage.type = stageElm.type;
			stage.dateStart = stageElm.dateStart;
			stage.quantity = resultsStage?.length;
			stage.timeBest = leaderResult.time;
			stage.leader = leaderResult.name;
			statistics.push(stage);
		});

		statistics.sort((a, b) => b.dateStart - a.dateStart);

		return statistics;
	} catch (error) {
		console.log(error);
	}
}
