import { Series } from '../../Model/Series.js';

export async function getSeries() {
	try {
		const seriesDB = await Series.find();
		return seriesDB;
	} catch (err) {
		console.log(err);
	}
}
