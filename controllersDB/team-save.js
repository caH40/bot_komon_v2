import { Rider } from '../Model/Rider.js';
import { Team } from '../Model/Team.js';

export async function registrationToDB(data) {
	try {
		const capitan = await Rider.findOne({ telegramId: data.telegramId });
		// райдер может состоять только в одной команде
		if (capitan.teamId)
			console.log(
				new Date().toLocaleString(),
				'team-save.js',
				'Спортсмен может состоять только в одной команде. Необходимо выйти из команды в который Вы состоите и только потом создавать новую!'
			);

		const team = new Team({
			name: data.name,
			description: data.description,
			riders: [
				{
					rider: capitan._id,
					dateJoin: new Date().getTime(),
				},
			],
		});

		const response = await team.save();
		if (!response) return console.log('Ошибка при сохранении данных команды!');

		const riderDB = await Rider.findOneAndUpdate(
			{ telegramId: data.telegramId },
			{ $set: { teamId: response._id } }
		);
		if (riderDB) {
			return riderDB;
		} else {
			console.log(`Ошибка при сохранении teamId ${response._id} в документа Rider`);
		}
	} catch (error) {
		console.log(error);
	}
}
