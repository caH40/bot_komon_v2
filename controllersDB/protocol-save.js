import { Result } from '../Model/Result.js';
import { Rider } from '../Model/Rider.js';
import { Stage } from '../Model/Stage.js';
import { ruleCategory } from '../utility/category-rule.js';
import { convertTime } from '../utility/date-convert.js';

export async function protocolToDB(dataResult, seriesId, stageId) {
	try {
		//riderId ,берется после идентификации райдера в протоколе
		const length = dataResult.length;
		for (let index = 0; index < length; index++) {
			let categoryCurrent = ruleCategory(
				dataResult[index].watt,
				dataResult[index].wattPerKg,
				dataResult[index].gender
			);
			let time =
				typeof dataResult[index].time === 'string'
					? convertTime(dataResult[index].time)
					: dataResult[index].time;

			let riderId = await Rider.findOne({ zwiftId: dataResult[index].zwiftId });
			let result = new Result({
				stageId,
				riderId,
				zwiftRiderId: dataResult[index].zwiftId,
				name: dataResult[index].name, //
				placeAbsolute: dataResult[index].placeAbsolute,
				watt: dataResult[index].watt,
				wattPerKg: dataResult[index].wattPerKg,
				time,
				category: riderId?.category,
				categoryCurrent,
				teamCurrent: dataResult[index].teamCurrent,
				pointsStage: dataResult[index].pointsStage,
				weightInGrams: dataResult[index].weightInGrams,
				heightInCentimeters: dataResult[index].heightInCentimeters,
				avgHeartRate: dataResult[index].avgHeartRate,
				gender: dataResult[index].gender,
				imageSrc: dataResult[index].imageSrc,
			});
			const response = await result.save().catch(error => console.log(error));
			if (response) {
				await Stage.findOneAndUpdate({ _id: stageId }, { $set: { hasResults: true } });
			} else {
				return console.log('Ошибка при сохранении данных результатов этапа!');
			}
		}
		return { results: dataResult, stageId };
	} catch (error) {
		console.log(error);
	}
}
