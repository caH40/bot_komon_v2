import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';

export async function getStatStages() {
	try {
		const resultsDB = await Result.find();
		const stagesDB = await Stage.find({ hasResults: true }).populate('seriesId');

		let statistics = [];
		stagesDB.forEach(stageElm => {
			const stage = {};
			const resultsStage = resultsDB.filter(
				result => String(result.stageId) === String(stageElm._id)
			);

			stage._id = resultsStage[0]?._id;
			stage.series = stageElm.seriesId.name;
			stage.number = stageElm.number;
			stage.route = stageElm.route;
			stage.type = stageElm.type;
			stage.dateStart = stageElm.dateStart;
			stage.quantity = resultsStage?.length;
			stage.timeBest = resultsStage?.sort((a, b) => a.time - b.time)[0].time;
			statistics.push(stage);
		});

		statistics.sort((a, b) => a.dateStart - b.dateStart);

		return statistics;
	} catch (error) {
		console.log(error);
	}
}
