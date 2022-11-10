import { mainMenu } from '../../keyboard/main-menu.js';
import { Result } from '../../Model/Result.js';
import { Rider } from '../../Model/Rider.js';
import { secondesToTime } from '../../utility/date-convert.js';
import { posting } from './posting.js';

export async function myResults(ctx) {
	try {
		await mainMenu(ctx);

		const userId = ctx.update.callback_query.message.chat.id;

		const riderDB = await Rider.findOne({ telegramId: userId });
		if (!riderDB) {
			return await ctx.reply(
				'Вы не зарегистрировались в боте. Для корректного отображения информации необходимо зарегистрироваться!'
			);
		}

		let resultsDB = await Result.find({ riderId: riderDB._id })
			.populate('stageId')
			.populate({ path: 'stageId', populate: { path: 'seriesId' } })
			.populate('riderId');

		if (resultsDB.length === 0) {
			return await ctx
				.reply(
					'Ваши результаты не найдены!\nЕсли Вы участвовали в заездах проводимых командой KOM-on, попробуйте изменить данные в аккаунте (регистрация) на валидные.'
				)
				.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
		}

		let myResultsObj = [];

		resultsDB.forEach((result, index) => {
			const resultStage = {
				sequenceNumber: index + 1,
				name: index + 1,
				nameSeries: result.stageId.seriesId.name,
				dateStart: new Date(result.stageId.dateStart).toLocaleDateString(),
				stageNumber: result.stageId.number,
				stageRoute: result.stageId.route,
				time: secondesToTime(result.time),
				placeAbsolute: result.placeAbsolute,
			};
			myResultsObj.push(resultStage);
		});

		const gender = riderDB.gender === 'мужской' ? `🧔‍♂️` : `👩`;

		const title = `${gender} <i>${riderDB.lastName} ${riderDB.firstName}</i>. Результаты: \n`;

		return posting(ctx, myResultsObj, title);
	} catch (error) {
		console.log(error);
	}
}
