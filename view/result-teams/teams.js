import { mainMenu } from '../../keyboard/main-menu.js';
import { Result } from '../../Model/Result.js';
import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';
import { Team } from '../../Model/Team.js';
import { posting } from './posting.js';

export async function resultsSeriesTeams(ctx, cbqData) {
	try {
		const seriesId = cbqData.slice(13);

		const seriesDB = await Series.findOne({ _id: seriesId });
		//пока для одного стейджа расчет
		const stagesDB = await Stage.find({ seriesId, hasResults: true });

		let resultsSeries = [];
		for (let i = 0; i < stagesDB.length; i++) {
			let resultsDB = await Result.find({
				stageId: stagesDB[i]._id,
				riderId: { $ne: undefined },
			}).populate({
				path: 'riderId',
				select: 'category',
			});
			resultsSeries = [...resultsSeries, ...resultsDB];
		}

		let teamsDB = await Team.find();

		const teams = [];
		const categories = ['A', 'B', 'C'];
		teamsDB.forEach(team => {
			categories.forEach(category => teams.push({ name: team.name, category, points: 0 }));
		});

		teams.forEach(team => {
			resultsSeries.forEach(result => {
				if (team.name === result.teamCurrent && team.category === result.riderId?.category) {
					team.points = team.points + result.pointsStage;
				}
			});
		});

		let teamSorted = [];

		categories.forEach(category => {
			let teamCat = teams
				.filter(team => team.category === category)
				.sort((a, b) => b.points - a.points);
			teamCat.forEach((team, index) => (team.place = index + 1));
			teamSorted.push(teamCat);
		});

		await mainMenu(ctx);

		return posting(ctx, teamSorted, seriesDB.name);
	} catch (error) {
		console.log(error);
	}
}
