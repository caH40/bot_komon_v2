import { filterResults } from './results-filter.js';
import { getRiders } from './riders-result.js';

export async function pointsMountain(series) {
	try {
		const resultsFiltered = await filterResults(series);
		const ridersResult = await getRiders(resultsFiltered);

		return ridersResult;
	} catch (error) {
		console.log(error);
	}
}
