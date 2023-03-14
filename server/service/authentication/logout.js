import { removeToken } from './token.js';

export async function logoutService(refreshToken) {
	try {
		await removeToken(refreshToken);
		return { message: 'Вы вышли из сервиса!' };
	} catch (error) {
		console.log(error);
		throw error;
	}
}
