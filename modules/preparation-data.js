import { secondesToTime, secondesToTimeThousandths } from '../utility/date-convert.js';

export function protocolPrep(fileJson) {
	try {
		fileJson = JSON.parse(fileJson);

		fileJson = fileJson.sort(
			(a, b) => a.activityData.durationInMilliseconds - b.activityData.durationInMilliseconds
		);
		const firstRiderTime = fileJson[0].activityData.durationInMilliseconds;
		let gender = 'мужской';

		const results = [];

		fileJson.forEach(result => {
			const timeString = secondesToTime(result.activityData.durationInMilliseconds);
			const wattPerKg =
				Math.round((result.sensorData.avgWatts / result.profileData.weightInGrams) * 100000) / 100;
			const name = `${result.profileData.firstName} ${result.profileData.lastName}`;
			const gap = secondesToTimeThousandths(
				result.activityData.durationInMilliseconds - firstRiderTime
			);

			if (result.profileData.gender === 'MALE') gender = 'мужской';
			if (result.profileData.gender === 'FEMALE') gender = 'женский';

			let resultRider = {
				zwiftId: result.profileId,
				placeAbsolute: result.rank,
				name,
				wattPerKg,
				watt: result.sensorData.avgWatts,
				weightInGrams: result.profileData.weightInGrams,
				heightInCentimeters: result.profileData.heightInCentimeters,
				avgHeartRate: result.sensorData.heartRateData.avgHeartRate,
				time: result.activityData.durationInMilliseconds,
				timeString,
				gap,
				gender,
				imageSrc: result.profileData.imageSrc,
			};
			results.push(resultRider);
		});
		return results;
	} catch (error) {
		console.log(error);
	}
}
