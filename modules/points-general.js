//обновление очков для каждого результата
import { Result } from '../Model/Result.js';
import { Stage } from '../Model/Stage.js';
import { getResultsWithPenalty } from '../preparation_data/results-penalty.js';
import { points } from './points.js';

export async function updatePointsGeneral(seriesId) {
	try {
		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({
				stageId: stagesDB[i]._id,
				// riderId: { $ne: undefined },
			}).populate('riderId');

			const hasPenalty = resultsDB.find(
				result => result.penalty.powerUp !== 0 || result.isDisqualification === true
			);
			if (hasPenalty) resultsDB = getResultsWithPenalty(resultsDB);

			//что делать если время одинаковое
			resultsDB = resultsDB.sort((a, b) => a.time - b.time);

			let placeA = 0;
			let placeB = 0;
			let placeC = 0;
			let placeW = 0;

			for (let j = 0; j < resultsDB.length; j++) {
				if (resultsDB[j].category === 'A') {
					placeA++;

					await Result.findByIdAndUpdate(
						{ _id: resultsDB[j]._id },
						{ $set: { pointsStage: points[placeA] ? points[placeA] : 0 } }
					);
				}
				if (resultsDB[j].category === 'B') {
					placeB++;
					let resp = await Result.findByIdAndUpdate(
						{ _id: resultsDB[j]._id },
						{ $set: { pointsStage: points[placeB] ? points[placeB] : 0 } },
						{ returnDocument: 'after' }
					);
					// console.log(resp.category, resp.name, resp.pointsStage, 'placeB-', placeB);
				}
				if (resultsDB[j].category === 'C') {
					placeC++;
					await Result.findByIdAndUpdate(
						{ _id: resultsDB[j]._id },
						{ $set: { pointsStage: points[placeC] ? points[placeC] : 0 } }
					);
				}
				if (resultsDB[j].category === 'W') {
					placeW++;
					await Result.findByIdAndUpdate(
						{ _id: resultsDB[j]._id },
						{ $set: { pointsStage: points[placeW] ? points[placeW] : 0 } }
					);
				}
			}
		}
		//костыль, пока не все девушки зарегистрировались
		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({
				stageId: stagesDB[i]._id,
				categoryCurrent: 'W',
			}).populate('riderId');

			resultsDB = resultsDB.sort((a, b) => a.time - b.time);
			let placeW = 0;
			for (let j = 0; j < resultsDB.length; j++) {
				placeW++;
				await Result.findByIdAndUpdate(
					{ _id: resultsDB[j]._id },
					{ $set: { pointsStage: points[placeW] } }
				);
			}
		}
		return true;
	} catch (error) {
		console.log(error);
	}
}
