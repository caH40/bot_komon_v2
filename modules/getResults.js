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
export async function getResultsSeriesForGeneral(seriesId) {
	try {
		const resultsTotal = [];
		const stageType = ['TT', 'mountain', 'mixed'];

		for (let typeNumber = 0; typeNumber < stageType.length; typeNumber++) {
			let results = [];
			let stagesDB = await Stage.find({
				seriesId,
				type: stageType[typeNumber],
				hasResults: true,
			});

			for (let i = 0; i < stagesDB.length; i++) {
				let resultsDB = await Result.find({ stageId: stagesDB[i]._id }).populate('riderId');
				results.push(...resultsDB);
			}

			let ridersWithZI = new Set();
			for (let i = 0; i < results.length; i++) {
				ridersWithZI.add(results[i].zwiftRiderId);
			}
			ridersWithZI = [...ridersWithZI];
			for (let i = 0; i < ridersWithZI.length; i++) {
				let resultsFiltered = results.filter(result => result.zwiftRiderId === ridersWithZI[i]);

				if (resultsFiltered.length === 2) {
					if (resultsFiltered[0].pointsStage > resultsFiltered[1].pointsStage) {
						resultsTotal.push(resultsFiltered[0]);
					} else {
						resultsTotal.push(resultsFiltered[1]);
					}
				} else if (resultsFiltered.length === 1) {
					resultsTotal.push(resultsFiltered[0]);
				}
			}
		}

		return resultsTotal;
	} catch (error) {
		console.log(error);
	}
}
