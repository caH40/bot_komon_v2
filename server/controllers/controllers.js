import { getResultsStage } from '../../preparation_data/results-stage.js';
import path from 'path';
import { Rider } from '../../Model/Rider.js';
import { Result } from '../../Model/Result.js';
import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';
import { resultsSeriesGeneral } from '../../preparation_data/general/general-series.js';
import { mountainTable, sprintTable } from '../../utility/points.js';
import { getPointsSM } from '../../preparation_data/points-sm/points-sm.js';

const __dirname = path.resolve();

export function mainPage(req, res) {
	try {
		res.status(200);
		res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	} catch (error) {
		console.log(error);
	}
}

export async function resultsStage(req, res) {
	try {
		const stageId = req.query.stageId;

		const resultsDB = await getResultsStage(stageId);

		if (resultsDB) return res.status(200).json({ message: `Результат найден`, resultsDB });
		return res.status(400).json({ message: `Результат не найден` });
	} catch (error) {
		console.log(error);
	}
}

export async function getRiderSettings(req, res) {
	try {
		const telegramId = req.query.telegramId;
		const riderDB = await Rider.findOne({ telegramId });
		if (riderDB)
			return res.status(200).json({ message: `Райдер найден`, settings: riderDB.settings.notice });
		return res.status(400).json({ message: `Райдер не найден` });
	} catch (error) {
		console.log(error);
	}
}

export async function postRiderSettings(req, res) {
	try {
		const { notice, telegramId } = req.body;

		const riderDB = await Rider.findOneAndUpdate(
			{ telegramId },
			{ $set: { 'settings.notice': notice } }
		);

		const messages = {
			true: 'Включено!',
			false: 'Выключено!',
			news: 'Оповещение о новостях:',
			newRace: 'Оповещение об анонсах заездов:',
			botInfo: 'Оповещение об изменениях данных в боте:',
			training: 'Оповещение о новых статьях про велотренировки:',
		};

		let response = '';
		const keys = Object.keys(notice);
		keys.forEach(key => {
			if (notice[key] !== riderDB.settings.notice[key])
				response = `${messages[key]} ${messages[notice[key]]}`;
		});

		if (riderDB)
			return res.status(200).json({ message: `Обновлены настройки оповещения`, response });
		return res.status(400).json({ message: `Райдер не найден в БД` });
	} catch (error) {
		console.log(error);
	}
}

export async function postStageEdit(req, res) {
	try {
		const data = req.body;

		const riderDB = await Rider.findOneAndUpdate(
			{ zwiftId: data.zwiftId },
			{ $set: { category: data.newCategory } }
		);
		// if (!riderDB) return res.status(400).json({ message: `Райдер не найден в БД` });

		const seriesDB = await Series.findOne({ stageId: data.stageId });
		if (!seriesDB) return res.status(400).json({ message: `Не найдена серия заездов` });

		const stagesDB = await Stage.find({ seriesId: seriesDB._id });
		if (stagesDB.length === 0)
			return res.status(400).json({ message: `Не найден ни один этап серии` });

		const resultDB = await Result.findOne({ zwiftRiderId: data.zwiftId });

		for (let i = 0; i < stagesDB.length; i++) {
			let response = await Result.updateMany(
				{ stageId: stagesDB[i]._id, zwiftRiderId: data.zwiftId },
				{ $set: { category: data.newCategory } }
			);
		}

		const message = `Успех! Райдеру "${resultDB.name}" изменена категория с "${resultDB.category}" на "${data.newCategory}"`;

		return res.status(200).json({ message });
	} catch (error) {
		console.log(error);
	}
}

export async function postStagePoints(req, res) {
	try {
		const { nameElement, name, place, resultId } = req.body;
		const numberElementPoints = +name.slice(-1) - 1;

		let pointsTable = {};
		if (nameElement === 'pointsMountain') pointsTable = mountainTable;
		if (nameElement === 'pointsSprint') pointsTable = sprintTable;

		const points = pointsTable.find(point => point.place === place)?.points;
		const elementPoints = `${nameElement}.${numberElementPoints}.points`;

		const elementPlace = `${nameElement}.${numberElementPoints}.place`;

		const { stageId } = await Result.findOne({ _id: resultId });

		if (place !== 'none') {
			const resultCheckingDB = await Result.findOne({ stageId, [elementPlace]: place });
			if (resultCheckingDB)
				return res.status(202).json({
					message: `Внимание!!! Место №${place} уже присвоено райдеру "${resultCheckingDB.name}"`,
				});
		}

		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { [elementPlace]: place, [elementPoints]: points } }
		);

		if (!resultDB) return res.status(400).json({ message: `Не найден результат id: ${resultId}` });
		let message = '';
		if (place === 'none') {
			message = `Успех! Райдеру "${resultDB.name}" установленно "${place}" в "${name}"`;
		} else {
			message = `Успех! Райдеру "${resultDB.name}" присвоено №${place} место в "${name}"`;
		}
		return res.status(200).json({ message });
	} catch (error) {
		console.log(error);
	}
}

export async function getGeneralPoints(req, res) {
	try {
		const seriesId = req.query.seriesId;
		const generalPoints = await resultsSeriesGeneral(seriesId);
		if (generalPoints)
			return res
				.status(200)
				.json({ message: `Данные по генеральному зачету получены`, generalPoints });
		return res.status(400).json({ message: `Ошибка при получении данных генерального зачета` });
	} catch (error) {
		console.log(error);
	}
}

export async function getMountainPoints(req, res) {
	try {
		const seriesId = req.query.seriesId;

		const pointsMountain = await getPointsSM(seriesId);

		if (pointsMountain)
			return res.status(200).json({ message: `Данные по горному зачету`, pointsMountain });
		return res.status(400).json({ message: `Ошибка при получении данных горного зачета` });
	} catch (error) {
		console.log(error);
	}
}

export async function getSprintPoints(req, res) {
	try {
		const seriesId = req.query.seriesId;

		const pointsSprint = await getPointsSM(seriesId);

		if (pointsSprint)
			return res.status(200).json({ message: `Данные по спринтерскому зачету`, pointsSprint });
		return res.status(400).json({ message: `Ошибка при получении данных спринтерского зачета` });
	} catch (error) {
		console.log(error);
	}
}
