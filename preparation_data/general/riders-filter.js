import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';

export async function filterRiders(seriesIdAndCategory, seriesId, category) {
	try {
		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		let results = [];
		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({ stageId: stagesDB[i]._id, category }).populate('stageId');
			results.push(...resultsDB);
		}

		let ridersTelegram = new Set();
		results.forEach(result => ridersTelegram.add(result.zwiftRiderId));
		ridersTelegram = [...ridersTelegram];

		let rider = { pointsStage: [] };
		const ridersWithPoints = [];

		ridersTelegram.forEach(zwiftRiderId => {
			const riderResults = results.filter(result => result.zwiftRiderId === zwiftRiderId);
			//массив с результатами одного райдера zwiftRiderId

			riderResults.forEach(result => {
				rider.isDisqualification = result.isDisqualification;
				rider.name = result.name;
				rider.zwiftRiderId = zwiftRiderId;
				rider.imageSrc = result.imageSrc ? result.imageSrc : '';
				rider.category = result.category;
				rider.resultStatus = true;
				rider.team = result.teamCurrent;
				rider.pointsStage.push({
					type: result.stageId.type,
					number: result.stageId.number,
					points: result.pointsStage,
				});
			});

			if (!rider.isDisqualification) ridersWithPoints.push(rider);

			rider = { pointsStage: [] };
		});

		return ridersWithPoints;
	} catch (error) {
		console.log(error);
	}
}
