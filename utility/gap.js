export async function maxValue(results) {
	try {
		let maxWatt = 0;
		let riderMaxWatt = {};

		let maxWattPerKg = 0;
		let riderMaxWattPerKg = {};

		results.forEach(rider => {
			if (+rider.watt > +maxWatt) {
				maxWatt = rider.watt;
				riderMaxWatt = rider;
			}
			if (+rider.wattPerKg > +maxWattPerKg) {
				maxWattPerKg = rider.wattPerKg;
				riderMaxWattPerKg = rider;
			}
		});

		results.forEach(rider => {
			if (rider.watt === maxWatt) rider.watt = maxWatt + ' max';
			if (rider.wattPerKg === maxWattPerKg) rider.wattPerKg = maxWattPerKg + ' max';
		});

		return results;
	} catch (error) {
		console.log(error);
	}
}
export async function gapValue(results) {
	try {
		//вычисление отставаний
		const lengthResult = results.length;
		for (let i = 0; i < lengthResult; i++) {
			results[i].gap = results[i].time - results[0].time;
			if (i + 1 !== lengthResult) results[i + 1].gapPrev = results[i + 1].time - results[i].time;
		}
		return results;
	} catch (error) {
		console.log(error);
	}
}
