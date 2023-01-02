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
export function gapValueTour(results) {
	try {
		//вычисление отставаний
		const lengthResult = results.length;
		for (let i = 1; i < results.length; i++) {
			results[i].gap = results[i].timeTotal - results[0].timeTotal;
			if (i !== lengthResult) results[i].gapPrev = results[i].timeTotal - results[i - 1].timeTotal;
		}
		return results;
	} catch (error) {
		console.log(error);
	}
}
