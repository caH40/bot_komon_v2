import { Result } from '../Model/Result.js';
import { Series } from '../Model/Series.js';
import { Stage } from '../Model/Stage.js';

export async function saveResult(result) {
	try {
		const searchDuplicate = await Result.findOne({
			stageId: result.stageId,
			zwiftRiderId: result.zwiftId,
		});
		if (searchDuplicate)
			return {
				response: false,
				message: `Ошибка. Результат данного райдера ${result.name} zwiftId:${result.zwiftId} уже есть в протоколе`,
			};

		const placeAbsolute = (await Result.find({ stageId: result.stageId })).length + 1;

		const { _id } = await Series.findOne({ stageId: result.stageId });
		const stagesDB = await Stage.find({ seriesId: _id });

		let name = result.name;
		let category = result.category;
		let imageSrc = result.imageSrc;

		for (let i = 0; i < stagesDB.length; i++) {
			let resultDB = await Result.findOne({ zwiftRiderId: result.zwiftId });
			if (resultDB) {
				name = resultDB.name;
				category = resultDB.category;
				imageSrc = resultDB.imageSrc;
				break;
			}
		}

		const newResult = new Result({
			stageId: result.stageId,
			name,
			zwiftRiderId: result.zwiftId,
			riderId: result.riderId,
			teamCurrent: result.teamId,
			time: result.time,
			weightInGrams: result.weightInGrams,
			watt: result.watt,
			wattPerKg: result.wattPerKg,
			heightInCentimeters: result.heightInCentimeters,
			avgHeartRate: result.avgHeartRate,
			category,
			categoryCurrent: result.categoryCurrent,
			imageSrc,
			isDidNotFinish: result.DNF.toLowerCase() === 'да' ? true : false,
			gender: result.gender,
			placeAbsolute,
		});

		const savedResult = await newResult.save();
		return { response: true, message: 'ok' };
	} catch (error) {
		console.log(error);
	}
}
