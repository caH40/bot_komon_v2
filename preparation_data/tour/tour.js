import { getFilterResults } from './results-filtered.js';
import { getResultsForView } from './results-view.js';

export async function resultsTourGeneral(seriesIdAndCategory) {
	try {
		const resultFiltered = await getFilterResults(seriesIdAndCategory);
		const results = await getResultsForView(resultFiltered);

		return results;
	} catch (error) {
		console.log(error);
	}
}
