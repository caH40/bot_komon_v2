import { Result } from '../../Model/Result.js';
import { Rider } from '../../Model/Rider.js';
import { Stage } from '../../Model/Stage.js';

export async function changeCategory(newCategory, zwiftId, stageId) {
	try {
		const riderDB = await Rider.findOneAndUpdate(
			{ zwiftId: zwiftId },
			{ $set: { category: newCategory } },
			{ returnDocument: 'after' }
		);

		// if (!riderDB) return { message: 'Не найден райдер для пенальти' };

		const stageDB = await Stage.findOne({ _id: stageId });
		if (!stageDB) return { message: `Не найден ни один этап серии`, status: 'fault' };

		const stagesDB = await Stage.find({ seriesId: stageDB.seriesId, hasResults: true });
		if (!stagesDB.length)
			return { message: `Не найден ни один этап серии с результатами`, status: 'fault' };

		const resultDB = await Result.findOne({ zwiftRiderId: zwiftId });

		for (let i = 0; i < stagesDB.length; i++) {
			let response = await Result.findOneAndUpdate(
				{ stageId: stagesDB[i]._id, zwiftRiderId: zwiftId },
				{ $set: { category: newCategory } },
				{ returnDocument: 'after' }
			);
		}

		const message = `Успех! Райдеру "${resultDB.name}" изменена категория с "${resultDB.category}" на "${newCategory}"`;

		return { message };
	} catch (error) {
		console.log(error);
		throw 'Непредвиденная ошибка на сервере';
	}
}
