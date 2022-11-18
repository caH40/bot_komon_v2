import { countPoints } from './points-count.js';
import { filterRiders } from './riders-filter.js';
import { sortRiders } from './riders-sort.js';
import { stagesCheck } from './stages-check.js';

export async function resultsSeriesGeneral(seriesIdAndCategory) {
	try {
		const seriesId = seriesIdAndCategory.slice(1);
		const category = seriesIdAndCategory.slice(0, 1);

		const ridersWithPoints = await filterRiders(seriesIdAndCategory, seriesId, category);
		const ridersChecked = await stagesCheck(ridersWithPoints, seriesId);
		const riderWithCountedPoints = countPoints(ridersChecked);
		const ridersFinalTable = sortRiders(riderWithCountedPoints);

		return ridersFinalTable;
	} catch (error) {
		console.log(error);
	}
}
