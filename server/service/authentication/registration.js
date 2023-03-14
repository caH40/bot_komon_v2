import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserConfirm } from '../../ModelServer/User-confirm.js';

import { User } from '../../ModelServer/User.js';
import { mailService } from './nodemailer.js';
import { generateToken, saveToken } from './token.js';

export async function registrationService(username, email, password) {
	try {
		const checkUsername = await User.findOne({ username });
		if (checkUsername) throw { message: `Username "${username}" уже занят` };
		const checkEmail = await User.findOne({ email });
		if (checkEmail) throw { message: `Пользователь с "${email}" уже существует` };

		const hashPassword = await bcrypt.hash(password, 10);
		const activationToken = uuidv4();
		const { _id: id, role } = await User.create({
			username,
			email,
			password: hashPassword,
			role: 'user',
			date: Date.now(),
		});

		await UserConfirm.create({
			userId: id,
			date: Date.now(),
			activationToken,
			email,
		});

		const target = 'registration'; //для отправки письма для активации
		const sendedMail = await mailService(target, activationToken, email, username, password);

		const tokens = await generateToken({ username, email, id, role });
		await saveToken(id, tokens.refreshToken);

		const message = 'Регистрация прошла успешно';
		return { ...tokens, message, user: { username, email, id, role } };
	} catch (error) {
		throw error;
	}
}
