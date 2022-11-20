export function sortRiders(ridersWithPoints) {
	try {
		ridersWithPoints = ridersWithPoints
			.filter(rider => rider.pointsTotal !== 0)
			.sort((a, b) => b.pointsTotal - a.pointsTotal);

		ridersWithPoints.forEach((rider, index) => (rider.sequence = index + 1));
		return ridersWithPoints;
	} catch (error) {
		console.log(error);
	}
}
