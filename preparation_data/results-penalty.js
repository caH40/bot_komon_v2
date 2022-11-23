import config from '../locales/config.json' assert { type: 'json' };

export function getResultsWithPenalty(results) {
	try {
		const timePenalty = config.penalty.powerUp;

		results.forEach(result => {
			if (result.penalty.powerUp !== 0) {
				result.time += timePenalty * result.penalty.powerUp;
			}
		});
		const resultsSorted = results.sort((a, b) => a.time - b.time);
		resultsSorted.forEach((result, index) => (result.placeAbsolute = index + 1));

		return resultsSorted;
	} catch (error) {
		console.log(error);
	}
}
