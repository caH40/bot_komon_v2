import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';
import { getResultsSeriesForGeneral } from '../../modules/getResults.js';
import { posting } from './posting.js';

export async function resultsSeriesGeneral(ctx, cbqData) {
	try {
		const seriesId = cbqData.slice(16);
		const category = cbqData.slice(14, 15);

		let resultsSeries = await getResultsSeriesForGeneral(seriesId);
		// сначала необходимо найти все элементы с уникальными именами
		let zwiftRiderIds = new Set();
		let points = 0;
		resultsSeries.forEach(elm => zwiftRiderIds.add(elm.zwiftRiderId));

		let resultsGeneral = [];
		zwiftRiderIds.forEach(zwiftRiderId => {
			points = 0;

			resultsSeries.forEach(elm => {
				if (zwiftRiderId === elm.zwiftRiderId) points += elm.pointsStage;
			});
			resultsGeneral.push({ zwiftRiderId, pointsGeneral: points });
		});
		//в будущем брать данные по группе и команде из коллекции Riders
		resultsGeneral = resultsGeneral.map(rider => {
			const categoryFilter = resultsSeries.find(elm => elm.zwiftRiderId === rider.zwiftRiderId);

			const categoryNew = categoryFilter.riderId
				? categoryFilter.riderId?.category
				: categoryFilter.category;
			return {
				zwiftRiderId: rider.zwiftRiderId,
				pointsGeneral: rider.pointsGeneral,
				name: resultsSeries.find(elm => elm.zwiftRiderId === rider.zwiftRiderId).name,
				firstName: resultsSeries.find(elm => elm.zwiftRiderId === rider.zwiftRiderId).riderId
					?.firstName,
				lastName: resultsSeries.find(elm => elm.zwiftRiderId === rider.zwiftRiderId).riderId
					?.lastName,
				category: categoryNew,
				team: resultsSeries.find(elm => elm.zwiftRiderId === rider.zwiftRiderId).team ?? '',
			};
		});

		const { name } = await Series.findOne({ _id: seriesId });

		resultsGeneral = resultsGeneral
			.filter(rider => rider.category === category)
			.sort((a, b) => b.pointsGeneral - a.pointsGeneral);
		resultsGeneral.forEach((rider, index) => {
			rider.place = index + 1;
		});

		return posting(ctx, resultsGeneral, category, name);
	} catch (error) {
		console.log(error);
	}
}
