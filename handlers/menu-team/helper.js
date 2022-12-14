import { addRiderDB, notAddRiderDB } from '../../controllersDB/team-add-rider.js';
import {
	clearCharts,
	teamAddRiderKeyboard,
	teamKeyboard,
	teamLeaveKeyboard,
	teamManagementKeyboard,
	teamRemoveRiderKeyboard,
	teamsKeyboard,
} from '../../keyboard/keyboard.js';
import { mainMenu } from '../../keyboard/main-menu.js';
import { Rider } from '../../Model/Rider.js';
import { Team } from '../../Model/Team.js';

export async function teamMain(ctx) {
	try {
		const userId = ctx.update.callback_query.message.chat.id;
		const riderDB = await Rider.findOne({ telegramId: userId }).populate('teamId');
		if (!riderDB)
			return await ctx.replyWithHTML('Для этого меню необходима <b>регистрация!</b> 🆔');

		let title = riderDB.teamId?.name
			? `Команда "${riderDB.teamId?.name}" 💪`
			: '🤝 Пора присоединяться к команде или создать свою!';

		return await ctx.editMessageText(`<b>${title}</b>`, await teamKeyboard(riderDB));
	} catch (error) {
		console.log(error);
	}
}
export async function teamChooseForJoin(ctx, cbqData) {
	try {
		const teamId = cbqData.slice(24);
		const userId = ctx.update.callback_query.from.id;

		const riderDB = await Rider.findOne({ telegramId: userId });

		// const monthAndHalfInMilliseconds = 45 * 24 * 3600000;
		// const today = new Date().getTime();

		const exTeam = await Team.findOne({ riders: { $elemMatch: { rider: riderDB._id } } });
		if (exTeam) {
			// const riderForCheck = exTeam.riders.find(
			// 	rider => rider.rider.toString() === riderDB._id.toString()
			// );
			// if (today - riderForCheck.dateLeave < monthAndHalfInMilliseconds)
			// 	return await ctx.reply(
			// 		`Вы выходили из команды ${exTeam.name} ${new Date(
			// 			riderForCheck.dateLeave
			// 		).toLocaleString()}. Трансферное окно закрыто до ${new Date(
			// 			monthAndHalfInMilliseconds + riderForCheck.dateLeave
			// 		).toLocaleString()}.`
			// 	);
			const response = await Team.findOneAndUpdate(
				{ _id: exTeam._id },
				{ $pull: { riders: { rider: riderDB._id } } }
			);
		}

		const teamDB = await Team.findOneAndUpdate(
			{ _id: teamId },
			{ $addToSet: { requestRiders: riderDB._id.toString() } },
			{ returnDocument: 'after' }
		).populate('riders.rider');

		const capitan = teamDB.riders[0].rider;
		if (teamDB.requestRiders.includes(riderDB._id)) {
			const time = new Date().toLocaleString();
			await ctx.telegram.sendMessage(
				capitan.telegramId,
				`
		${time}. Поступила заявка от райдера <b>${riderDB.firstNameZwift} ${riderDB.lastNameZwift} (${riderDB.firstName} ${riderDB.lastName})</b> на присоединение к Вашей команде.\n<i>Позже можно рассмотреть заявки на присоединение к команде в личном кабинете.</i>
		
		`,
				teamAddRiderKeyboard(riderDB._id)
			);
			await ctx
				.reply(
					`Вы подали заявку на присоединение к команде "${teamDB.name}". Капитан команды @${capitan.telegramUsername} рассмотрит заявку и примет решение.`
				)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		} else {
			await ctx
				.retry(
					'Что то пошло не так, произошла ошибка! Попробуйте повторить операцию через некоторое время.'
				)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		}
		return await mainMenu(ctx);
	} catch (error) {
		console.log(error);
	}
}

export async function teamJoin(ctx) {
	try {
		const teamDB = await Team.find({ isAllowed: true });
		if (teamDB.length === 0)
			return await ctx
				.replyWithHTML('Очень странно, не создано ни одной команды 🤷‍♂️')
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return await ctx.editMessageText(
			`<b>📌 Список зарегистрированных команд</b>`,
			teamsKeyboard(teamDB)
		);
	} catch (error) {
		console.log(error);
	}
}

export async function teamCreate(ctx) {
	try {
		await mainMenu(ctx);
		return await ctx.scene.enter('firstSceneCreateTeam');
	} catch (error) {
		console.log(error);
	}
}
export async function teamLeave(ctx) {
	try {
		const userId = ctx.update.callback_query.from.id;

		const riderDB = await Rider.findOne({ telegramId: userId }).populate('teamId');
		let teamName = riderDB.teamId?.name;

		return await ctx.editMessageText(
			`<b>🚪 Выход из команды "${teamName}"</b>`,
			teamLeaveKeyboard(riderDB._id)
		);
	} catch (error) {
		console.log(error);
	}
}
export async function teamManagement(ctx) {
	try {
		const userId = ctx.update.callback_query.from.id;

		const riderDB = await Rider.findOne({ telegramId: userId }).populate('teamId');
		let teamName = riderDB.teamId?.name;

		return await ctx.editMessageText(
			`<b>💼 Управление командой "${teamName}"</b>`,
			teamManagementKeyboard(riderDB._id)
		);
	} catch (error) {
		console.log(error);
	}
}
export async function teamAddRider(ctx) {
	try {
		const userId = ctx.update.callback_query.from.id;

		const riderDB = await Rider.findOne({ telegramId: userId }).populate('teamId');
		const candidates = riderDB.teamId.requestRiders;

		if (candidates.length === 0)
			return await ctx
				.reply('Нет заявок активных заявок в команду.')
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		candidates.forEach(async _id => {
			const riderDB = await Rider.findOne({ _id });
			let title = `
Райдер: ${riderDB.lastName} ${riderDB.firstName}
Звифт: ${riderDB.lastNameZwift} ${riderDB.firstNameZwift}
`;
			await ctx
				.reply(title, teamAddRiderKeyboard(riderDB._id))
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		});
	} catch (error) {
		console.log(error);
	}
}

export async function teamApprovalRider(ctx, cbqData) {
	try {
		const action = cbqData.slice(14, 15);
		const candidateId = cbqData.slice(16);

		if (action === 'Y') await addRiderDB(ctx, candidateId);
		if (action === 'N') await notAddRiderDB(ctx, candidateId);
	} catch (error) {
		console.log(error);
	}
}

export async function teamRemoveRider(ctx) {
	try {
		const userId = ctx.update.callback_query.from.id;

		const riderDB = await Rider.findOne({ telegramId: userId }).populate('teamId');
		let teamId = riderDB.teamId?._id;
		const ridersDB = await Rider.find({ $and: [{ teamId }, { _id: { $ne: riderDB._id } }] });

		if (ridersDB.length === 0)
			return await ctx
				.reply('Вы единственный райдер в команде, Вам некого удалять из команды!')
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		ridersDB.forEach(async rider => {
			let title = `
Райдер: ${rider.lastName} ${rider.firstName}
Звифт: ${rider.lastNameZwift} ${rider.firstNameZwift}
`;
			await ctx
				.reply(title, teamRemoveRiderKeyboard(rider._id))
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		});
	} catch (error) {
		console.log(error);
	}
}
export async function teamRemove(ctx) {
	try {
		const monthInMilliseconds = 2592000000;
		const userId = ctx.update.callback_query.from.id;
		const riderDB = await Rider.findOne({ telegramId: userId }).populate('teamId');
		const ridersDB = await Rider.find({ teamId: riderDB?.teamId._id });

		if (ridersDB.length > 1)
			return await ctx
				.reply(
					'Вы не можете удалить команду, если в ней есть райдеры. Сначала необходимо удалить райдеров из команды.'
				)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		const teamDB = await Team.findOne({ _id: riderDB.teamId._id }).catch(error =>
			console.log(error)
		);

		if (Date.now() - teamDB.riders[0].dateJoin > monthInMilliseconds) {
			await Team.findOneAndUpdate(
				{ _id: riderDB.teamId._id },
				{ $set: { deleted: { isDeleted: true, date: Date.now() } } }
			).catch(error => console.log(error));
		} else {
			await Team.findOneAndDelete({ _id: riderDB.teamId._id }).catch(error => console.log(error));
		}

		await Rider.findOneAndUpdate({ telegramId: userId }, { $unset: { teamId: 1 } }).catch(error =>
			console.log(error)
		);

		await ctx
			.reply(`Вы удалили команду "${riderDB.teamId.name}"`)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));

		return mainMenu(ctx);
	} catch (error) {
		console.log(error);
	}
}
export async function teamWait(ctx) {
	try {
		return await ctx
			.reply(`Надо немного подождать до принятия решения капитаном команды...`)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
}
export async function teamDescription(ctx) {
	try {
		await ctx.scene.enter('teamDescription');
	} catch (error) {
		console.log(error);
	}
}
export async function teamLogo(ctx) {
	try {
		await ctx.scene.enter('teamLogo');
	} catch (error) {
		console.log(error);
	}
}
export async function handlerTeams(ctx) {
	try {
		const teamsDB = await Team.find({ 'deleted.isDeleted': false, isAllowed: true }).populate({
			path: 'riders',
			populate: { path: `rider` },
		});
		if (teamsDB.length === 0) {
			return await ctx
				.reply('Нет зарегистрированных команд!')
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		}
		teamsDB.forEach(async team => {
			let listRiders = '';
			team.riders.forEach((rider, index) => {
				if (rider.dateLeave) return;
				listRiders += `${index + 1}. ${rider.rider.firstName} ${rider.rider.lastName} ${
					index === 0 ? ' (К)' : ''
				};\n`;
			});
			const name = team.name;
			const description = team.description;
			const logoUrl = team.logoUrl;

			const caption = `<b>${name}</b>\n${description}\n${listRiders}`;
			await ctx
				.replyWithPhoto(logoUrl, { parse_mode: 'html', caption })
				// .replyWithPhoto(logoUrl, { ...clearCharts, caption })
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id))
				.catch(e => console.log(e));
		});
	} catch (error) {
		console.log(error);
	}
}
