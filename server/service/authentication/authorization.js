import bcrypt from 'bcrypt';
import { Rider } from '../../../Model/Rider.js';

import { generateToken, removeToken, saveToken } from './token.js';

export async function authorizationService(username, password, refreshToken) {
	try {
		const userDB = await Rider.findOne({ username });

		const wrongAuth = { message: `Неверный Логин или Пароль`, status: 'wrong' };
		if (!userDB) return wrongAuth;

		const isValidPassword = await bcrypt.compare(password, userDB.password);
		if (!isValidPassword) return wrongAuth;

		await removeToken(refreshToken);

		const tokens = await generateToken({
			username,
			email: userDB.email,
			id: userDB._id,
			role: userDB.role,
		});
		await saveToken(userDB._id, tokens.refreshToken);

		const message = 'Авторизация прошла успешно';
		return {
			...tokens,
			message,
			user: {
				username,
				email: userDB.email,
				id: userDB._id,
				role: userDB.role,
				photoProfile: userDB.photoProfile,
			},
		};
	} catch (error) {
		console.log(error);
		throw error;
	}
}
