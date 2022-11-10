export function divisionChart(data) {
	try {
		const newData = [];
		const quantityPath = Math.trunc(data.length / 26);
		let j = 0;
		let k = 26;
		for (let i = 0; i < quantityPath + 1; i++) {
			newData.push(data.slice(j, k));
			j += 26;
			k += 26;
		}

		return newData;
	} catch (error) {
		console.log(error);
	}
}
