import bcrypt from 'bcrypt';

import { User } from '../../ModelServer/User.js';
import { mailService } from './nodemailer.js';

export async function newPasswordService(userId, newPassword) {
	try {
		const hashPassword = await bcrypt.hash(newPassword, 10);
		const userDB = await User.findOneAndUpdate(
			{ _id: userId },
			{ $set: { password: hashPassword } }
		);
		if (!userDB) throw { message: 'Ошибка при сохранении нового пароля!' };
		const target = 'savedNewPassword';
		mailService(target, 'нет токена', userDB.email, userDB.username, newPassword);
		return { message: `Пароль изменен` };
	} catch (error) {
		throw error;
	}
}
