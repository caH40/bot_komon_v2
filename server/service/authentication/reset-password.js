import { v4 as uuidv4 } from 'uuid';

import { PasswordReset } from '../../../Model/Password-reset.js';
import { Rider } from '../../../Model/Rider.js';
import { mailService } from './nodemailer.js';

export async function resetPasswordService(email) {
	try {
		const userDB = await Rider.findOne({ email });
		if (!userDB) throw { message: 'e-mail не найден' };

		const tokenReset = uuidv4();
		const passwordResetDB = await PasswordReset.create({
			userId: userDB._id,
			email,
			tokenReset,
			date: Date.now(),
		});

		const target = 'resetPassword';
		await mailService(target, tokenReset, email, userDB.username);

		return { message: `Сброс пароля `, email };
	} catch (error) {
		throw error;
	}
}
