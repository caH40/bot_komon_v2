import { Markup } from 'telegraf';
import { Rider } from '../../Model/Rider.js';
import { Team } from '../../Model/Team.js';

export async function teamBtn(rider) {
	try {
		let hasTeam = rider.teamId;
		let isAllowed = false;
		let isCandidate = false;
		let capitanId;

		const riderDB = await Rider.findOne({ _id: rider._id }).populate({
			path: 'teamId',
			populate: 'riders.rider',
		});

		if (rider.teamId) {
			isAllowed = riderDB.teamId.isAllowed;
			capitanId = riderDB.teamId.riders[0].rider._id;
		}

		let isCapitan = false;
		if (rider._id?.toString() === capitanId?.toString()) isCapitan = true;

		//проверка райдера на заявки в вступление в команду
		const teamDB = await Team.findOne({ requestRiders: riderDB._id });
		if (teamDB) isCandidate = true;

		return [
			hasTeam && isAllowed
				? [Markup.button.callback('Список райдеров 📜', `m_3_2_E__${rider.teamId.name}`)]
				: [],
			isCandidate ? [Markup.button.callback('Ваша заявка на рассмотрении', 'm_3_2_0_wait')] : [],
			hasTeam || isCandidate ? [] : [Markup.button.callback('Присоединиться 🙏', 'm_3_2_2_')],
			hasTeam || isCandidate ? [] : [Markup.button.callback('Создать ⚒️', 'm_3_2_3_S__create')],
			hasTeam && isAllowed ? [Markup.button.callback('Покинуть команду 🚪', 'm_3_2_4_')] : [],
			hasTeam && isAllowed && isCapitan
				? [Markup.button.callback('Управление командой 💼', 'm_3_2_5_')]
				: [],
			[Markup.button.callback('Главное меню ❗️', 'main')],
		];
	} catch (error) {
		console.log(error);
	}
}
export function teamsBtn(teams) {
	try {
		return [
			...teams.map(team => [
				Markup.button.callback(`${team.name} 👍`, `m_3_2_2_all_E__teamJoin_${team._id}`),
			]),
			[Markup.button.callback('Главное меню ❗️', 'main')],
		];
	} catch (error) {
		console.log(error);
	}
}
