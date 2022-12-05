export function filterThousandths(results) {
	try {
		const lengthArr = results.length;

		if (results[0].time.split('.')[0] !== results[1].time.split('.')[0])
			results[0].time = results[0].time.split('.')[0];

		if (results[lengthArr - 1].time.split('.')[0] !== results[lengthArr - 2].time.split('.')[0])
			results[lengthArr - 1].time = results[lengthArr - 1].time.split('.')[0];

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

		if (results[lengthArr - 1].time.split('.')[0] !== results[lengthArr - 2].time.split('.')[0])
			results[lengthArr - 1].time = results[lengthArr - 1].time.split('.')[0];
	} catch (error) {
		console.log(error);
	}
}
