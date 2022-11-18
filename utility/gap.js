export async function gapValue(results) {
	try {
		//вычисление отставаний
		const lengthResult = results.length;
		for (let i = 1; i < lengthResult; i++) {
			results[i].gap = results[i].time - results[0].time;
			if (i !== lengthResult) results[i].gapPrev = results[i].time - results[i - 1].time;
		}
		return results;
	} catch (error) {
		console.log(error);
	}
}
