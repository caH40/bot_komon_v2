import { filterResults } from './results-filter.js';
import { getRiders } from './riders-result.js';
import { sortRiders } from './riders-sort.js';

export async function getPointsSM(series) {
	try {
		const resultsFiltered = await filterResults(series);
		const ridersResult = await getRiders(resultsFiltered, series);
		const ridersSorted = sortRiders(ridersResult);

		return ridersSorted;
	} catch (error) {
		console.log(error);
	}
}
