export function sortRiders(riderWithCountedPoints) {
	try {
		const ridersCorrectResults = riderWithCountedPoints
			.filter(rider => rider.resultStatus === true)
			.sort((a, b) => b.pointsTotal - a.pointsTotal);
		const ridersIncorrectResults = riderWithCountedPoints
			.filter(rider => rider.resultStatus === false)
			.sort((a, b) => b.pointsTotal - a.pointsTotal);

		const ridersFinalTable = [...ridersCorrectResults, ...ridersIncorrectResults];
		ridersFinalTable.forEach((rider, index) => (rider.sequence = index + 1));

		return ridersFinalTable;
	} catch (error) {
		console.log(error);
	}
}
