import { Stage } from '../../Model/Stage.js';

export async function stagesCheck(ridersWithPoints, seriesId) {
	try {
		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		ridersWithPoints.forEach(rider => {
			if (stagesDB.length === 4) {
				if (!rider.pointsStage.find(stage => stage.type === 'TT')) rider.resultStatus = false;
			}
			if (stagesDB.length === 5) {
				if (
					!rider.pointsStage.find(stage => stage.type === 'TT') ||
					!rider.pointsStage.find(stage => stage.type === 'mountain')
				)
					rider.resultStatus = false;
			}
			if (stagesDB.length === 6) {
				if (
					!rider.pointsStage.find(stage => stage.type === 'TT') ||
					!rider.pointsStage.find(stage => stage.type === 'mountain') ||
					!rider.pointsStage.find(stage => stage.type === 'mixed')
				)
					rider.resultStatus = false;
			}
		});

		return ridersWithPoints;
	} catch (error) {
		console.log(error);
	}
}
