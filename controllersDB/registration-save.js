import { Result } from '../Model/Result.js';
import { Rider } from '../Model/Rider.js';

export async function registrationToDB(data) {
	try {
		const riderDB = await Rider.findOne({ telegramId: data.telegramId });
		if (riderDB)
			return await Rider.findOneAndUpdate(
				{ telegramId: data.telegramId },
				{
					$set: {
						firstName: data.firstName,
						lastName: data.lastName,
						firstNameZwift: data.firstNameZwift,
						lastNameZwift: data.lastNameZwift,
						zwiftId: data.zwiftId,
						telegramUsername: data.telegramUsername,
						cycleTrainer: data.cycleTrainer,
						zwiftPower: data.zwiftPower,
						// yearBirth: data.yearBirth,
						category: data.category,
						gender: data.gender,
					},
				}
			);

		let rider = new Rider({
			firstName: data.firstName,
			zwiftId: data.zwiftId,
			lastName: data.lastName,
			firstNameZwift: data.firstNameZwift,
			lastNameZwift: data.lastNameZwift,
			telegramUsername: data.telegramUsername,
			telegramId: data.telegramId,
			cycleTrainer: data.cycleTrainer,
			zwiftPower: data.zwiftPower,
			// yearBirth: data.yearBirth,
			category: data.category,
			gender: data.gender,
		});

		const riderSaved = await rider.save();
		if (riderSaved) {
			const resultsDB = await Result.updateMany(
				{ zwiftRiderId: riderSaved.zwiftId },
				{ $set: { riderId: riderSaved._id } },
				{ returnDocument: 'after' }
			);
			return resultsDB;
		} else {
			console.log('Ошибка при сохранении данных регистрации пользователя!');
		}
	} catch (error) {
		console.log(error);
	}
}
