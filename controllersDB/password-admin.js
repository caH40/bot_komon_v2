import { Rider } from '../Model/Rider.js';
import { Rights } from '../Model/Rights.js';
import bcrypt from 'bcrypt';

export async function savePassword(telegramId, password) {
	try {
		const adminDB = await Rights.findOne({ admin: { $in: telegramId } });
		if (!adminDB)
			return { message: 'Пароль устанавливается только для админов бота!', response: true };

		const saltRounds = 10;
		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(password, salt);

		const riderDB = await Rider.findOneAndUpdate({ telegramId }, { $set: { password: hash } });
		if (!riderDB) return false;
		return {
			message:
				'<b>Пароль установлен! ✅</b>\nПароль хранится в хешированном виде, поэтому нет возможности его восстановления!\nПовторная установка пароля перезапишет старый пароль!',
			response: true,
		};
	} catch (error) {
		console.log(error);
	}
}
