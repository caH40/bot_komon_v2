import { Rights } from '../../Model/Rights.js';

export async function sendMessageAdmin(ctx) {
	try {
		const adminDB = await Rights.findOne();
		adminDB.admin.forEach(async admin => {
			ctx.telegram.sendMessage(
				admin,
				`${new Date().toLocaleString()}.\nПоявилась заявка на создание команды "${
					ctx.session.data.teamCreate.name
				}".\nНеобходимо рассмотреть эту заявку в \n"Админ кабинет" >> \n"Управление командами" >> \n"Заявки на создание команды".`
			);
		});
	} catch (error) {
		console.log(error);
	}
}
