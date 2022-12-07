import { countPoints } from './points-count.js';
import { filterRiders } from './riders-filter.js';
import { filterRidersOldW } from './riders-filterOldW.js';
import { sortRiders } from './riders-sort.js';
import { stagesCheck } from './stages-check.js';

export async function resultsSeriesGeneral(seriesIdAndCategory) {
	try {
		let seriesId = '';
		let category = '';
		if (
			seriesIdAndCategory.includes('WA') ||
			seriesIdAndCategory.includes('WB') ||
			seriesIdAndCategory.includes('WT')
		) {
			seriesId = seriesIdAndCategory.slice(2);
			category = seriesIdAndCategory.slice(0, 2);
		} else {
			seriesId = seriesIdAndCategory.slice(1);
			category = seriesIdAndCategory.slice(0, 1);
		}
		let ridersWithPoints = [];
		if (seriesIdAndCategory.includes('WT')) {
			ridersWithPoints = await filterRidersOldW(seriesId, category);
		} else {
			ridersWithPoints = await filterRiders(seriesId, category);
		}
		const ridersChecked = await stagesCheck(ridersWithPoints, seriesId);
		const riderWithCountedPoints = countPoints(ridersChecked);
		const ridersFinalTable = sortRiders(riderWithCountedPoints);

		return ridersFinalTable;
	} catch (error) {
		console.log(error);
	}
}
