import { filterResults } from './results-filter.js';
import { getPoints } from './results-points.js';

export async function getPointsTeams(seriesId) {
	try {
		const results = await filterResults(seriesId);
		const resultsPoints = await getPoints(results);

		return resultsPoints;
	} catch (error) {
		console.log(error);
	}
}
