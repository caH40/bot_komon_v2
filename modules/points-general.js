//обновление очков для каждого результата
import { Result } from '../Model/Result.js';
import { Stage } from '../Model/Stage.js';
import { points } from './points.js';

export async function updatePointsGeneral(seriesId) {
	try {
		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({
				stageId: stagesDB[i]._id,
				riderId: { $ne: undefined },
			}).populate('riderId');

			//что делать если время одинаковое
			resultsDB = resultsDB.sort((a, b) => a.time - b.time);

			let placeA = 0;
			let placeB = 0;
			let placeC = 0;
			let placeW = 0;

			for (let j = 0; j < resultsDB.length; j++) {
				if (resultsDB[j].riderId?.category === 'A') {
					placeA++;

					await Result.findByIdAndUpdate(
						{ _id: resultsDB[j]._id },
						{ $set: { pointsStage: points[placeA] } }
					);
				}
				if (resultsDB[j].riderId?.category === 'B') {
					placeB++;
					await Result.findByIdAndUpdate(
						{ _id: resultsDB[j]._id },
						{ $set: { pointsStage: points[placeB] } }
					);
				}
				if (resultsDB[j].riderId?.category === 'C') {
					placeC++;
					await Result.findByIdAndUpdate(
						{ _id: resultsDB[j]._id },
						{ $set: { pointsStage: points[placeC] } }
					);
				}
				if (resultsDB[j].riderId?.category === 'W') {
					placeW++;
					await Result.findByIdAndUpdate(
						{ _id: resultsDB[j]._id },
						{ $set: { pointsStage: points[placeW] } }
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
