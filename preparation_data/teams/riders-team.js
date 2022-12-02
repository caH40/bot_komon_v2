import { Team } from '../../Model/Team.js';

export async function getTeamWithRiders() {
	try {
		let teamsDB = await Team.find({ 'deleted.isDeleted': false }).populate({
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
