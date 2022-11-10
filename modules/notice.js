import { Rider } from '../Model/Rider.js';
import { Stage } from '../Model/Stage.js';

export async function noticeGetResult(ctx, protocol) {
	try {
		const ridersDB = await Rider.find();
		const stageDB = await Stage.findOne({ _id: protocol.stageId }).populate('seriesId');

		ridersDB.forEach((rider, index) => {
			let zwiftIdCur = protocol.results.find(result => +result.zwiftId === rider.zwiftId)?.zwiftId;

			let subMessage = zwiftIdCur ? 'в котором Вы принимали участие.' : '';
			let message = `${new Date().toLocaleString()}. Загружены результаты этапа №${
				stageDB.number
			} ${stageDB.seriesId.name} ${subMessage} 📋`;

			setTimeout(() => {
				ctx.telegram.sendMessage(rider.telegramId, message);
			}, index * 30);
		});
	} catch (error) {
		console.log(error);
	}
}
