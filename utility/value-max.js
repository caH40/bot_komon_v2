export async function maxValue(results) {
	try {
		let maxWatt = 0;
		let maxWattPerKg = 0;
		let maxHeightInCentimeters = 0;
		let maxWeightInGrams = 0;
		let maxAvgHeartRate = 0;

		results.forEach(rider => {
			if (+rider.watt > +maxWatt) {
				maxWatt = rider.watt;
			}
			if (+rider.wattPerKg > +maxWattPerKg) {
				maxWattPerKg = rider.wattPerKg;
			}
			if (+rider.heightInCentimeters > +maxHeightInCentimeters) {
				maxHeightInCentimeters = rider.heightInCentimeters;
			}
			if (+rider.weightInGrams > +maxWeightInGrams) {
				maxWeightInGrams = rider.weightInGrams;
			}
			if (+rider.avgHeartRate > +maxAvgHeartRate) {
				maxAvgHeartRate = rider.avgHeartRate;
			}
		});

		results.forEach(rider => {
			if (rider.watt === maxWatt) rider.watt = maxWatt + 'max';
			if (rider.wattPerKg === maxWattPerKg) rider.wattPerKg = maxWattPerKg + 'max';
			if (rider.heightInCentimeters === maxHeightInCentimeters)
				rider.heightInCentimeters = maxHeightInCentimeters + 'max';
			if (rider.weightInGrams === maxWeightInGrams) {
				rider.weightInGrams = maxWeightInGrams + 'max';
			}
			if (rider.avgHeartRate === maxAvgHeartRate) {
				rider.avgHeartRate = maxAvgHeartRate + 'max';
			}
		});

		return results;
	} catch (error) {
		console.log(error);
	}
}
