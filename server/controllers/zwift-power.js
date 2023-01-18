import path from 'path';

import { getResultsStage } from '../../preparation_data/results-stage.js';
import { setDisqualification } from '../service/disqualification.js';
import { getSeries } from '../service/series.js';
import { getStages } from '../service/stages.js';

const __dirname = path.resolve();

export async function postSeries(req, res) {
	try {
		const series = await getSeries();
		return res.status(200).json({ message: `Данные серий заездов`, series });
	} catch (error) {
		res.status(400).json({ message: `Ошибка при получении данных серий` });
		console.log(error);
	}
}

export async function postStages(req, res) {
	try {
		const { series } = req.body;
		const stages = await getStages(series);
		return res.status(200).json({ message: `Данные этапов серии`, stages });
	} catch (error) {
		res.status(400).json({ message: `Ошибка при получении данных этапов серии` });
		console.log(error);
	}
}

export async function postStage(req, res) {
	try {
		const { seriesId, stageId } = req.body;

		const stage = await getResultsStage(`T${stageId}`);

		return res.status(200).json({ message: `Результаты этапа id="${stageId}"`, stage });
	} catch (error) {
		res.status(400).json({ message: `Ошибка при получении результатов этапа id="${stageId}"` });
		console.log(error);
	}
}

export async function postZpDisqualification(req, res) {
	try {
		const { isDisqualification, resultId } = req.body;

		const disqualification = await setDisqualification(isDisqualification, resultId);

		return res.status(200).json({ message: disqualification.message });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: `Ошибка при дисквалификации` });
	}
}
