import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserConfirm } from '../../../Model/User-confirm.js';

import { Rider } from '../../../Model/Rider.js';
import { mailService } from './nodemailer.js';
import { generateToken, saveToken } from './token.js';

export async function registrationService(username, email, password) {
	try {
		const checkUsername = await Rider.findOne({ username });
		if (checkUsername) return { message: `Username "${username}" уже занят`, status: 'wrong' };
		const checkEmail = await Rider.findOne({ email });
		if (checkEmail)
			return { message: `Пользователь с "${email}" уже существует`, status: 'wrong' };

		const hashPassword = await bcrypt.hash(password, 10);
		const activationToken = uuidv4();
		const { _id: id, role } = await Rider.create({
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
		console.log(error);
		throw error;
	}
}
