import { Result } from '../../Model/Result.js';
import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';

export async function setCategory(zwiftId, gender) {
	try {
		let seriesDB = await Series.find();
		seriesDB = seriesDB.sort((a, b) => b.dateStart - a.dateStart);

		if (seriesDB.length === 0) return;

		let stageDB = await Stage.find({ seriesId: seriesDB[0]._id });

		let resultDb = {};
		for (let i = 0; i < stageDB.length; i++) {
			resultDb = await Result.findOne({ stageId: stageDB[i], zwiftRiderId: zwiftId });
			if (resultDb?.category) return resultDb.category;
		}

		//если нет результата в последней серии, значит поиск в предпоследней
		stageDB = await Stage.find({ seriesId: seriesDB[1]?._id });

		for (let i = 0; i < stageDB.length; i++) {
			resultDb = await Result.findOne({ stageId: stageDB[i], zwiftRiderId: zwiftId });
			if (resultDb?.category) return resultDb.category;
		}

		if (gender === 'мужской') return 'C';
		return 'W';
	} catch (error) {
		console.log(error);
	}
}
