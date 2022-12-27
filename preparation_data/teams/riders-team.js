import { Team } from '../../Model/Team.js';

export async function getTeamWithRiders() {
	try {
		let teamsDB = await Team.find({ 'deleted.isDeleted': false, isAllowed: true }).populate({
			path: 'riders.rider',
		});

		for (let i = teamsDB.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[teamsDB[i], teamsDB[j]] = [teamsDB[j], teamsDB[i]];
		}

		teamsDB.forEach(team => {
			team.riders = team.riders.filter(rider => rider.dateLeave === undefined);
		});

		return teamsDB;
	} catch (error) {
		console.log(error);
	}
}

export async function getRidersWithPoints(results, ridersSet, teamNames) {
	try {
		const ridersInTeam = [];

		let rider = {};
		rider.stages = [];

		ridersSet.forEach(riderZId => {
			let resultsRider = results.filter(result => result.zwiftRiderId === riderZId);

			resultsRider = resultsRider.sort((a, b) => a.stageId.number - b.stageId.number);

			resultsRider.forEach(result => {
				rider.teamName = result.teamCurrent.name;
				rider.riderName = result.name;
				rider.imageSrc = result.imageSrc;

				if (result.pointsStageOldW) result.pointsStage = result.pointsStageOldW;

				rider.stages.push({ stageNumber: result.stageId.number, points: result.pointsStage });
			});
			ridersInTeam.push(rider);
			rider = {};
			rider.stages = [];
		});

		const ridersWithPoints = [];
		teamNames.forEach(teamName => {
			const teamWithRiders = ridersInTeam.filter(rider => rider.teamName === teamName);
			ridersWithPoints.push({ teamName, riders: teamWithRiders });
		});

		return ridersWithPoints;
	} catch (error) {
		console.log(error);
	}
}
