export function filterThousandths(results) {
	try {
		const lengthArr = results.length;
		let first = results[0].time;
		let last = results[lengthArr - 1].time;

		if (first.split('.')[0] !== results[1].time.split('.')[0]) first = first.split('.')[0];

		if (last.split('.')[0] !== results[lengthArr - 2].time.split('.')[0]) last = last.split('.')[0];

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
