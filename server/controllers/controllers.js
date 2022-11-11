import { getResultsStage } from '../../preparation_data/results-stage.js';
import path from 'path';

const __dirname = path.resolve();

export function mainPage(req, res) {
	try {
		console.log('static', req.query.stageId);
		res.status(200);
		res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	} catch (error) {
		console.log(error);
	}
}
export async function resultsStage(req, res) {
	try {
		console.log('dyn=============');
		const stageId = req.query.stageId;

		const resultsDB = await getResultsStage(stageId);

		if (resultsDB) return res.status(200).json({ message: `Результат найден`, resultsDB });
		return res.status(400).json({ message: `Результат не найден` });
	} catch (error) {
		console.log(error);
	}
}
