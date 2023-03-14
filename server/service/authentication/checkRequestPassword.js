import { v4 as uuidv4 } from 'uuid';

import { PasswordReset } from '../../../Model/Password-reset.js';

export async function checkRequestPasswordService(tokenReset) {
	try {
		const resetPasswordDB = await PasswordReset.findOneAndDelete({ tokenReset });
		if (!resetPasswordDB)
			return { message: 'Не найден запрос на сброс пароля!', status: 'wrong' };
		const userId = resetPasswordDB.userId;
		await PasswordReset.deleteMany({ userId });

		return {
			message: `Запросы на сброс пароля удалены, ожидается ввод нового пароля`,
			userId,
		};
	} catch (error) {
		console.log(error);
		throw { message: `Ошибка при сбросе пароля` };
	}
}
