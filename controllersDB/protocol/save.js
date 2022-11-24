import { Result } from '../../Model/Result.js';
import { Rider } from '../../Model/Rider.js';
import { Stage } from '../../Model/Stage.js';
import { updateCategoryDB } from './category.js';
import { ruleCategory } from '../../utility/category-rule.js';
import { convertTime } from '../../utility/date-convert.js';

export async function protocolToDB(results, seriesId, stageId) {
	try {
		const stageDB = await Stage.findOne({ _id: stageId });
		if (!stageDB) return console.log('Не найден этап в БД', stageId);

		const pointsSprint = [];
		const pointsMountain = [];
		for (let i = 1; i < stageDB.quantitySprints + 1; i++)
			pointsSprint.push({
				sprint: i,
				place: 'none',
			});
		for (let i = 1; i < stageDB.quantityMountains + 1; i++)
			pointsMountain.push({
				mountain: i,
				place: 'none',
			});

		const length = results.length;
		for (let index = 0; index < length; index++) {
			let categoryCurrent = ruleCategory(
				results[index].watt,
				results[index].wattPerKg,
				results[index].gender
			);

			const newCategory = await updateCategoryDB(stageDB.seriesId, results[index], categoryCurrent);
			let time =
				typeof results[index].time === 'string'
					? convertTime(results[index].time)
					: results[index].time;

			let riderId = await Rider.findOne({ zwiftId: results[index].zwiftId });
			let result = new Result({
				stageId,
				riderId,
				zwiftRiderId: results[index].zwiftId,
				name: results[index].name, //
				placeAbsolute: results[index].placeAbsolute,
				watt: results[index].watt,
				wattPerKg: results[index].wattPerKg,
				time,
				category: newCategory.category,
				categoryCurrent,
				teamCurrent: results[index].teamCurrent,
				pointsStage: results[index].pointsStage,
				pointsSprint,
				pointsMountain,
				weightInGrams: results[index].weightInGrams,
				heightInCentimeters: results[index].heightInCentimeters,
				avgHeartRate: results[index].avgHeartRate,
				gender: results[index].gender,
				imageSrc: results[index].imageSrc,
			});
			const response = await result.save().catch(error => console.log(error));
			if (response) {
				await Stage.findOneAndUpdate({ _id: stageId }, { $set: { hasResults: true } });
			} else {
				return console.log('Ошибка при сохранении данных результатов этапа!');
			}
		}
		return { results: results, stageId };
	} catch (error) {
		console.log(error);
	}
}
