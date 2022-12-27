import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';
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
		if (!results[0]) return console.log('Нет результатов в серии');

		const stageDB = await Stage.findOne({ _id: results[0].stageId });
		const stagesDB = await Stage.find({ seriesId: stageDB.seriesId, hasResults: true });
		const quantityStages = stagesDB.length;

		const ridersInTeam = [];

		let rider = {};
		rider.stages = [];

		ridersSet.forEach(riderZId => {
			let resultsRider = results.filter(result => result.zwiftRiderId === riderZId);

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

		ridersWithPoints.forEach(team => {
			team.riders = team.riders.sort((a, b) => a.riderName.localeCompare(b.riderName));

			team.riders.forEach(rider => {
				for (let i = 0; i < quantityStages; i++) {
					if (!rider.stages.find(stage => stage.stageNumber === i + 1))
						rider.stages.push({ stageNumber: i + 1, points: '-' });
				}
				rider.stages = rider.stages.sort((a, b) => a.stageNumber - b.stageNumber);
			});
		});

		return ridersWithPoints;
	} catch (error) {
		console.log(error);
	}
}
