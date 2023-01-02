export async function getResultsForView(results) {
	try {
		let zwiftIdsSet = new Set();
		let stagesSet = new Set();
		for (let i = 0; i < results.length; i++) {
			zwiftIdsSet.add(results[i].zwiftRiderId);
			stagesSet.add(results[i].stageId.number);
		}

		const stages = Array.from(stagesSet);

		let resultsForView = [];

		zwiftIdsSet.forEach(zwiftId => {
			let time = [];
			let timeTotal = 0;
			let isDisqualification = false;

			const resultsRider = results
				.filter(result => result.zwiftRiderId === zwiftId)
				.sort((a, b) => a.stageId.number - b.stageId.number);

			resultsRider.forEach(resultRider => {
				timeTotal += resultRider.time;
				const timeStage = resultRider.time;
				const stageNumber = resultRider.stageId.number;
				time.push({ timeStage, stageNumber });
			});

			if (resultsRider.length !== stages.length) isDisqualification = true;
			resultsForView.push({
				name: resultsRider[0]?.name,
				imageSrc: resultsRider[0]?.imageSrc,
				timeTotal,
				isDisqualification,
				time,
			});
		});

		resultsForView = resultsForView
			.filter(result => result.isDisqualification === false)
			.sort((a, b) => a.timeTotal - b.timeTotal);

		return resultsForView;
	} catch (error) {
		console.log(error);
	}
}
