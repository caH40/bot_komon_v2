import { Result } from '../../Model/Result.js';
import { mountainTable, sprintTable } from '../../utility/points.js';

export async function setPoints(pointsType, sequenceNumber, place, resultId, multiplier = 1) {
	try {
		console.log({ pointsType, sequenceNumber, place, resultId });

		const elementPoints = `${pointsType}.${sequenceNumber - 1}.points`;
		const elementPlace = `${pointsType}.${sequenceNumber - 1}.place`;

		const { stageId } = await Result.findOne({ _id: resultId });

		if (place !== 'none') {
			const resultCheckingDB = await Result.findOne({ stageId, [elementPlace]: place });
			if (resultCheckingDB)
				return {
					message: `Внимание!!! Место №${place} уже присвоено райдеру "${resultCheckingDB.name}"`,
					status: 'false',
				};
		}

		let pointsTable = {};

		if (pointsType === 'pointsMountain') pointsTable = mountainTable;
		if (pointsType === 'pointsSprint') pointsTable = sprintTable;

		let points = pointsTable.find(point => point.place === place)?.points;
		points = Math.ceil(points * multiplier);

		console.log({ [elementPlace]: place, [elementPoints]: points });
		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { [elementPlace]: place, [elementPoints]: points } }
		);

		if (!resultDB) return console.log('не найден результат для обновления');

		const message = `${resultDB.name} присвоено "${place}" место в "${
			pointsType === 'pointsSprint' ? 'Спринте-' + sequenceNumber : 'Горе-' + sequenceNumber
		}"`;

		return { message };
	} catch (error) {
		console.log(error);
		throw 'Непредвиденная ошибка на сервере';
	}
}
