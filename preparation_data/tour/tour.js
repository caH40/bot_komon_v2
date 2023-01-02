import { filterResults } from '../points-sm/results-filter.js';

export async function resultsTourGeneral(seriesIdAndCategory) {
	try {
		const resultFiltered = await filterResults(seriesIdAndCategory);
	} catch (error) {
		console.log(error);
	}
}
