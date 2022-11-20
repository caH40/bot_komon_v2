import { Stage } from '../../Model/Stage.js';

export async function getRiders(results) {
	try {
		let ridersTelegram = new Set();
		results.forEach(result => ridersTelegram.add(result.zwiftRiderId));
		ridersTelegram = [...ridersTelegram];

		let rider = {};
		let ridersWithPoints = [];

		ridersTelegram.forEach(zwiftRiderId => {
			const riderResults = results.filter(result => result.zwiftRiderId === zwiftRiderId);
			//массив с результатами одного райдера zwiftRiderId
			riderResults.forEach(result => {
				rider.stageNumber = result.stageId.number;
				rider.stageType = result.stageId.type;
				rider.name = result.name;
				rider.zwiftRiderId = zwiftRiderId;
				rider.imageSrc = result.imageSrc ? result.imageSrc : '';
				rider.category = result.category;
				rider.team = result.teamCurrent;
				rider.pointsMountain = result.pointsMountain;

				let points = 0;
				result.pointsMountain.forEach(elm => (points += elm.points));
				rider.pointsTotal = points;
			});
			ridersWithPoints.push(rider);
			rider = {};
		});
		ridersWithPoints = ridersWithPoints.filter(rider => rider.pointsTotal !== 0);

		return ridersWithPoints;
	} catch (error) {
		console.log(error);
	}
}
