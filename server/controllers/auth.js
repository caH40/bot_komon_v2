import bcrypt from 'bcrypt';

import { Rider } from '../../Model/Rider.js';
import { Rights } from '../../Model/Rights.js';

export async function checkAdmin(password, telegramId) {
	try {
		const adminDB = await Rights.findOne({ admin: { $in: telegramId } });
		if (!adminDB) return false;

		const riderDB = await Rider.findOne({ telegramId });
		const hash = riderDB.password;

		const isValid = bcrypt.compareSync(password, hash);
		if (isValid) return hash;
		return false;
	} catch (error) {
		console.log(error);
	}
}
export async function checkAdminWithHash(hashFromFront, telegramId) {
	try {
		const adminDB = await Rights.findOne({ admin: { $in: telegramId } });
		if (!adminDB) return false;

		const riderDB = await Rider.findOne({ telegramId });
		const hash = riderDB.password;

		if (hashFromFront === hash) return true;
		return false;
	} catch (error) {
		console.log(error);
	}
}
