import { Result } from '../../Model/Result.js';
import { secondesToTime } from '../../utility/date-convert.js';

export async function getProfile(zwiftRiderId) {
	try {
		const resultsDB = await Result.find(
			{ zwiftRiderId },
			{
				name: true,
				imageSrc: true,
				category: true,
				placeAbsolute: true,
				time: true,
				watt: true,
				wattPerKg: true,
				avgHeartRate: true,
				weightInGrams: true,
				heightInCentimeters: true,
				penalty: true,
				isDisqualification: true,
				isDidNotFinish: true,
			}
		).populate({
			path: 'stageId',
			select: ['route', 'dateStart'],
			populate: { path: 'seriesId', select: 'name' },
		});

		const resultsObj = resultsDB.map(result => result.toObject());
		const results = [];

		resultsObj.forEach(result => {
			results.push({
				...result,
				time: secondesToTime(result.time),
				weightInGrams: Math.round(result.weightInGrams / 10) / 100,
				stageId: result.stageId._id,
				date: result.stageId.dateStart,
				route: result.stageId.route,
				series: result.stageId.seriesId.name,
			});
		});

		results.sort((a, b) => a.date - b.date);
		return results;
	} catch (error) {
		console.log(error);
	}
}
