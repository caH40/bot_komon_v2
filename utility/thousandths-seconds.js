export function filterThousandths(results) {
	try {
		const lengthArr = results.length;

		for (let i = 1; i < lengthArr; i++) {
			let timePrev = '';
			let timeCurrent = '';
			let timeNext = '';

			if (i + 1 === lengthArr) return results;
			timePrev = results[i - 1].time.split('.')[0];
			timeCurrent = results[i].time.split('.')[0];
			timeNext = results[i + 1].time.split('.')[0];

			if (timeCurrent !== timePrev && timeCurrent !== timeNext) {
				results[i].time = timeCurrent;
			}
		}
	} catch (error) {
		console.log(error);
	}
}
