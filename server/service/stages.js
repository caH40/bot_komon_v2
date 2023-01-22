import { Stage } from '../../Model/Stage.js';

export async function getStages(series) {
	try {
		const stagesDB = await Stage.find({ seriesId: series }).populate({
			path: 'seriesId',
			select: 'name',
		});
		return stagesDB;
	} catch (err) {
		console.log(err);
	}
}

export async function getStage(stageId) {
	try {
		const stageDB = await Stage.findOne({ _id: stageId });
		return { message: `Получены данные по этапу №${stageDB.number}`, data: stageDB };
	} catch (error) {
		console.log(error);
		throw 'Непредвиденная ошибка на сервере';
	}
}
