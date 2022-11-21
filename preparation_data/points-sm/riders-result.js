import { Stage } from '../../Model/Stage.js';

export async function getRiders(results, series) {
	try {
		const seriesId = series.slice(1);
		const type = series.slice(0, 1);
		const stringForType = {
			S: { quantity: 'quantitySprints', points: 'pointsSprint' },
			M: { quantity: 'quantityMountains', points: 'pointsMountain' },
		};

		const stagesDB = await Stage.find({ seriesId, [stringForType[type].quantity]: { $ne: 0 } });

		let stage = [];
		stagesDB.forEach(stageDB => {
			stage.push({
				number: stageDB.number,
				route: stageDB.route,
				[stringForType[type].quantity]: stageDB[stringForType[type].quantity],
			});
		});
		stage = stage.sort((a, b) => a.number - b.number);

		let ridersTelegram = new Set();
		results.forEach(result => ridersTelegram.add(result.zwiftRiderId));
		ridersTelegram = [...ridersTelegram];

		let rider = {};
		rider[stringForType[type].points] = [];
		let ridersWithPoints = [];
		let points = 0;

		ridersTelegram.forEach(zwiftRiderId => {
			const riderResults = results.filter(result => result.zwiftRiderId === zwiftRiderId);

			//массив с результатами одного райдера zwiftRiderId
			riderResults.forEach(result => {
				rider.stages = stage;
				rider.name = result.name;
				rider.zwiftRiderId = zwiftRiderId;
				rider.imageSrc = result.imageSrc ? result.imageSrc : '';
				rider.category = result.category;
				rider.team = result.teamCurrent;
				result[stringForType[type].points].forEach(pointsStage => {
					pointsStage.stageNumber = result.stageId.number;
				});

				rider[stringForType[type].points].push(...result[stringForType[type].points]);

				result[stringForType[type].points].forEach(elm => {
					points += elm.points;
				});
				rider.pointsTotal = points;
			});
			ridersWithPoints.push(rider);
			rider = {};
			rider[stringForType[type].points] = [];
			points = 0;
		});

		return ridersWithPoints;
	} catch (error) {
		console.log(error);
	}
}
