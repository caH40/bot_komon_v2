import { getRidersWithPoints } from './riders-team.js';

export async function getPoints(results) {
	try {
		const teamNames = new Set();
		const stageNumbersSet = new Set();
		let ridersSet = new Set();

		results.forEach(result => {
			if (result.teamCurrent) teamNames.add(result.teamCurrent.name);
			if (result.stageId) stageNumbersSet.add(result.stageId.number);
			ridersSet.add(result.zwiftRiderId);
		});

		const ridersWithPoints = await getRidersWithPoints(results, ridersSet, teamNames);

		let stageNumbers = [...stageNumbersSet];
		stageNumbers = stageNumbers.sort((a, b) => a - b);

		let teams = [];

		stageNumbers.forEach(stage => {
			teamNames.forEach(name => {
				let points = 0;
				results.forEach(result => {
					if (result.pointsStageOldW) result.pointsStage = result.pointsStageOldW;
				});
				const team = results
					.filter(result => result.teamCurrent?.name === name && stage === result.stageId.number)
					.sort((a, b) => b.pointsStage - a.pointsStage)
					.slice(0, 5);

				team.forEach(stageResult => (points += stageResult.pointsStage));
				teams.push({
					name,
					stageNumber: stage,
					points,
					logoBase64: team[0]?.teamCurrent?.logoBase64,
				});
			});
		});

		let teamsWithTotalPoints = [];
		teamNames.forEach(name => {
			let pointsTotal = 0;
			let teamFiltered = teams.filter(team => team.name === name);
			teamFiltered = teamFiltered.sort((a, b) => a.stageNumber - b.stageNumber);
			const teamName = teamFiltered[0]?.name;
			const logoBase64 = teamFiltered[0]?.logoBase64;
			const riders = ridersWithPoints.find(element => element.teamName === name);

			teamFiltered.forEach(team => {
				pointsTotal += team.points;
				delete team.name;
				delete team.logoBase64;
			});
			teamsWithTotalPoints.push({
				team: teamFiltered,
				riders: riders.riders,
				pointsTotal,
				teamName,
				logoBase64,
			});
		});

		teamsWithTotalPoints = teamsWithTotalPoints.sort((a, b) => b.pointsTotal - a.pointsTotal);
		return teamsWithTotalPoints;
	} catch (error) {
		console.log(error);
	}
}
