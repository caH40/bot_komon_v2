import { getResultsStage } from '../../preparation_data/results-stage.js';
import path from 'path';
import { Rider } from '../../Model/Rider.js';
import { Result } from '../../Model/Result.js';
import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';

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
			{ $set: { 'settings.notice': notice } },
			{
				returnDocument: 'after',
			}
		);

		if (riderDB)
			return res
				.status(200)
				.json({ message: `Обновлены настройки оповещения`, settings: riderDB.settings });
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

		const element = `${nameElement}.${numberElementPoints}.place`;

		const { stageId } = await Result.findOne({ _id: resultId });

		const resultCheckingDB = await Result.findOne({ stageId, [element]: place });
		if (resultCheckingDB)
			return res.status(202).json({
				message: `Внимание!!! Место №${place} уже присвоено райдеру "${resultCheckingDB.name}"`,
			});

		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { [element]: place } }
		);

		if (!resultDB) return res.status(400).json({ message: `Не найден результат id: ${resultId}` });

		const message = `Успех! Райдеру "${resultDB.name}" присвоено №${place} место в "${name}"`;
		return res.status(200).json({ message });
	} catch (error) {
		console.log(error);
	}
}
