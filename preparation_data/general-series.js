import { Series } from '../Model/Series.js';
import { Stage } from '../Model/Stage.js';
import { generalRiders } from './general-riders.js';
import { getResultsSeriesForGeneral } from './results-series.js';

export async function resultsSeriesGeneral(seriesIdAndCategory) {
	try {
		const seriesId = seriesIdAndCategory.slice(1);
		const category = seriesIdAndCategory.slice(0, 1);

		let resultsSeries = await generalRiders(seriesId, category);
		console.log(resultsSeries.length);
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
		// console.log(resultsGeneral);
		return resultsGeneral;
	} catch (error) {
		console.log(error);
	}
}
