import { Stage } from '../../Model/Stage.js';

export async function getRiders(results, series) {
	try {
		const seriesId = series.slice(1);
		const stagesDB = await Stage.find({ seriesId, quantityMountains: { $ne: 0 } });

		let stage = [];
		stagesDB.forEach(stageDB => {
			stage.push({
				number: stageDB.number,
				route: stageDB.route,
				quantityMountains: stageDB.quantityMountains,
			});
		});
		stage = stage.sort((a, b) => a.number - b.number);

		let ridersTelegram = new Set();
		results.forEach(result => ridersTelegram.add(result.zwiftRiderId));
		ridersTelegram = [...ridersTelegram];

		let rider = {};
		rider.pointsMountain = [];
		let ridersWithPoints = [];
		let points = 0;

		ridersTelegram.forEach(zwiftRiderId => {
			const riderResults = results.filter(result => result.zwiftRiderId === zwiftRiderId);

			//массив с результатами одного райдера zwiftRiderId
			riderResults.forEach(result => {
				console.log(result.pointsMountain);
				rider.stages = stage;
				rider.name = result.name;
				rider.zwiftRiderId = zwiftRiderId;
				rider.imageSrc = result.imageSrc ? result.imageSrc : '';
				rider.category = result.category;
				rider.team = result.teamCurrent;
				result.pointsMountain.forEach(pointsStage => {
					pointsStage.stageNumber = result.stageId.number;
				});

				rider.pointsMountain.push(...result.pointsMountain);

				result.pointsMountain.forEach(elm => {
					points += elm.points;
				});
				rider.pointsTotal = points;
			});
			ridersWithPoints.push(rider);
			rider = {};
			rider.pointsMountain = [];
			points = 0;
		});

		return ridersWithPoints;
	} catch (error) {
		console.log(error);
	}
}
