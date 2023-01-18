import { Result } from '../../Model/Result.js';

export async function setUnderChecking(isUnderChecking, resultId) {
	try {
		const resultDB = await Result.findOneAndUpdate(
			{ _id: resultId },
			{ $set: { isUnderChecking } }
		);

		if (!resultDB) return { message: 'Не найден райдер для дисквалификации' };

		const message = `Райдер "${resultDB.name}" ${
			isUnderChecking
				? 'один раз превысил показатели своей категории!'
				: 'оправдан, с него сняты подозрения о превышении показателей текущей категории!'
		}`;
		return { message };
	} catch (error) {
		console.log(error);
	}
}
