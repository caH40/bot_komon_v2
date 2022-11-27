import {
	adminCatRidersFromStageKeyboard,
	adminPointsSeriesKeyboard,
	pointsSMboard,
	editDataSeriesKeyboard,
	editDataStagesKeyboard,
	teamForApprovalKeyboard,
} from '../../keyboard/keyboard.js';
import { mainMenu } from '../../keyboard/main-menu.js';
import { Result } from '../../Model/Result.js';
import { Rider } from '../../Model/Rider.js';
import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';
import { Team } from '../../Model/Team.js';
import { updatePointsGeneral } from '../../modules/points-general.js';
import { updateRequiredTypes } from '../../modules/types-required.js';

export async function requestTeam(ctx) {
	try {
		const teamsDB = await Team.find({ isAllowed: false }).populate('riders.rider');
		if (teamsDB.length === 0) return await ctx.reply('Нет заявок на создание команды.');

		teamsDB.forEach(async team => {
			let title = `
Команда: "${team.name}";
Капитан: ${team.riders[0].rider.lastName} ${team.riders[0].rider.firstName};
Описание: ${team.description};

`;
			await ctx
				.reply(`${title}`, teamForApprovalKeyboard(team._id))
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		});

		return;
	} catch (error) {
		console.log(error);
	}
}
export async function approvalTeam(ctx, cbqData) {
	try {
		const action = cbqData.slice(13, 14);
		const teamId = cbqData.slice(15);

		const teamDB = await Team.findOne({ _id: teamId }).populate('riders.rider');
		if (action === 'Y') {
			const teamDB = await Team.findOneAndUpdate({ _id: teamId }, { $set: { isAllowed: true } });
			const capitan = teamDB.riders[0];
			const resultsDB = await Result.updateMany(
				{ riderId: capitan.rider },
				{ $set: { teamCurrent: teamDB._id } }
			);
		}
		if (action === 'N') {
			await Rider.findOneAndUpdate({ teamId }, { $unset: { teamId: 1 } });
			await Team.findOneAndDelete({ _id: teamId });
		}

		const time = new Date().toLocaleString();
		const title =
			action === 'Y'
				? `${time}. Создание команды "${teamDB.name}" одобрено!`
				: `${time}. Создание команды "${teamDB.name}" отклонено!`;

		await ctx.telegram.sendMessage(teamDB.riders[0].rider.telegramId, title);
		return await ctx
			.reply(title)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
}

export async function categoryRiderFromStage(ctx) {
	try {
		const stagesDB = await Stage.find({ hasResults: true }).populate('seriesId');
		return await ctx.editMessageText(
			'<b>🛠️ Выберите заезд по результатам которого будут присвоены категории ❗️ всем участникам заезда (зарегистрированным участникам).</b>',
			adminCatRidersFromStageKeyboard(stagesDB)
		);
	} catch (error) {
		console.log(error);
	}
}

export async function pointsSeries(ctx) {
	try {
		const seriesDB = await Series.find();
		return ctx.editMessageText(
			'<b>🔄 Обновление генеральных зачетов.\nВыберите серию в которой необходимо обновить очки в генеральной, спринтерской горной номинациях.</b>',
			adminPointsSeriesKeyboard(seriesDB)
		);
	} catch (error) {
		console.log(error);
	}
}
export async function editDataSeries(ctx) {
	try {
		const seriesDB = await Series.find();
		const seriesSorted = seriesDB.sort((a, b) => b.dateStart - a.dateStart);
		return ctx.editMessageText(
			'<b>🔧 Редактирование данных заезда. Выбор серии.</b>',
			editDataSeriesKeyboard(seriesSorted)
		);
	} catch (error) {
		console.log(error);
	}
}

export async function editDataStages(ctx, cbqData) {
	try {
		const seriesId = cbqData.slice(11);
		const stagesDB = await Stage.find({ seriesId, hasResults: true });
		return ctx.editMessageText(
			'<b>🔧 Редактирование данных заезда. Выбор этапа.</b>',
			editDataStagesKeyboard(stagesDB)
		);
	} catch (error) {
		console.log(error);
	}
}
export async function editDataStage(ctx, cbqData) {
	try {
		const stageId = cbqData.slice(15);
		return ctx.editMessageText('<b>💨 Спринт и горный зачеты.</b>', pointsSMboard(stageId));
	} catch (error) {
		console.log(error);
	}
}
export async function pointsSprinter(ctx, cbqData) {
	try {
		const stageId = cbqData.slice(17);
		ctx.session.data.stageId = stageId;
		await ctx.scene.enter('pointsSprinter');
	} catch (error) {
		console.log(error);
	}
}
export async function pointsMountain(ctx, cbqData) {
	try {
		const stageId = cbqData.slice(17);
		ctx.session.data.stageId = stageId;
		await ctx.scene.enter('pointsMountain');
	} catch (error) {
		console.log(error);
	}
}

export async function updatePointsSeries(ctx, cbqData) {
	try {
		await mainMenu(ctx);

		const seriesId = cbqData.slice(9);
		const response = await updatePointsGeneral(seriesId);
		const requiredTypes = await updateRequiredTypes(seriesId);

		const seriesDB = await Series.findOne({ _id: seriesId });

		if (response) {
			ctx
				.reply(
					`${new Date().toLocaleString()}. Обновление очковых квалификаций серии ${
						seriesDB.name
					} прошло успешно!`
				)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		} else {
			await ctx
				.reply(
					`${new Date().toLocaleString()}. При обновление очковых квалификаций серии ${
						seriesDB.name
					} произошла непредвиденная ошибка...`
				)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		}
	} catch (error) {
		console.log(error);
	}
}
