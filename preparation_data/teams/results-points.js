export async function getPoints(results) {
	try {
		const teamNames = new Set();
		const stageNumbersSet = new Set();
		results.forEach(result => {
			if (result.teamCurrent) teamNames.add(result.teamCurrent.name);
			if (result.stageId) stageNumbersSet.add(result.stageId.number);
		});

		let stageNumbers = [...stageNumbersSet];
		stageNumbers = stageNumbers.sort((a, b) => a - b);

		let teams = [];

		stageNumbers.forEach(stage => {
			teamNames.forEach(name => {
				let points = 0;
				const team = results
					.filter(result => result.teamCurrent?.name === name && stage === result.stageId.number)
					.sort((a, b) => b.pointsStage - a.pointsStage)
					.slice(0, 5);
				team.forEach(stageResult => (points += stageResult.pointsStage));
				teams.push({ name, stageNumber: stage, points });
			});
		});

		let teamsWithTotalPoints = [];
		teamNames.forEach(name => {
			let pointsTotal = 0;
			let teamFiltered = teams.filter(team => team.name === name);
			teamFiltered = teamFiltered.sort((a, b) => a.stageNumber - b.stageNumber);

			teamFiltered.forEach(team => (pointsTotal += team.points));
			teamsWithTotalPoints.push({ team: teamFiltered, pointsTotal });
		});

		teamsWithTotalPoints = teamsWithTotalPoints.sort((a, b) => b.pointsTotal - a.pointsTotal);

		return teamsWithTotalPoints;
	} catch (error) {
		console.log(error);
	}
}
