import { getResultsStage } from '../../preparation_data/results-stage.js';
import path from 'path';
import { Rider } from '../../Model/Rider.js';

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
