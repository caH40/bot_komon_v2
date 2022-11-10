//обновление данных: брать или нет данные очки для генеральных зачетов, когда прошли заезды на этапах с одним типом больше одного

import { Result } from '../Model/Result.js';
import { Rider } from '../Model/Rider.js';
import { Stage } from '../Model/Stage.js';
import { getTypes } from './types-quantity.js';

export async function updateRequiredTypes(seriesId) {
	try {
		const stagesDB = await Stage.find({ seriesId, hasResults: true });
		const types = await getTypes(stagesDB);
		const ridersDB = await Rider.find();

		//поучение всех результатов с зарегистрированными райдерами
		let resultsSeries = [];
		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({
				stageId: stagesDB[i]._id,
				riderId: { $ne: undefined },
			}).populate({
				path: 'riderId',
				select: 'category',
			});
			resultsSeries = [...resultsSeries, ...resultsDB];
		}

		types.forEach(async typeStage => {
			if (typeStage.type > 1) {
				let resultsOnlyOneType = resultsSeries.filter(result => result.type === typeStage.type);

				for (let i = 0; i < ridersDB.length; i++) {
					//ищу все результаты райдера в текущем типе этапа
					let resultRider = resultsOnlyOneType.filter(
						result => result.riderId.toString === ridersDB._id.toString()
					);
					console.log(resultRider);
					//меньшему результату ставлю false в документе результат
					if (resultRider.length > 1) {
						if (resultRider[0].pointsStage > resultRider[1].pointsStage) {
							await Result.findOneAndUpdate(
								{ _id: resultRider[1]._id },
								{ $set: { isNeedCount: false } }
							);
						} else {
							await Result.findOneAndUpdate(
								{ _id: resultRider[0]._id },
								{ $set: { isNeedCount: false } }
							);
						}
					}
					// если нет ни одного результата в текущем типе этапа, значит все результаты райдера не идут в генеральный зачет
					if (resultRider.length === 0) {
						return await Result.updateMany(
							{ riderId: ridersDB._id },
							{ $set: { isNeedCount: false } }
						);
					}
				}
			}
		});
	} catch (error) {
		console.log(error);
	}
}
