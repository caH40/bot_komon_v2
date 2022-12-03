import { Result } from '../../Model/Result.js';
import { Rider } from '../../Model/Rider.js';
import { Stage } from '../../Model/Stage.js';

export async function updateCategoryDB(seriesId, result, categoryCurrent) {
	try {
		// закомментировал для первого этапа
		// const riderDB = await Rider.findOne({ zwiftId: result.zwiftId });
		// //если аккаунт существует, то выход
		// if (riderDB) return { category: riderDB.category };

		// const stageDB = await Stage.find({ seriesId });

		// for (let i = 0; i < stageDB.length; i++) {
		// 	const riderZwiftIdDB = await Result.findOne({
		// 		stageId: stageDB[i],
		// 		zwiftRiderId: result.zwiftId,
		// 	});
		// 	if (riderZwiftIdDB) return { category: riderZwiftIdDB.category };
		// }

		const riderDB = await Rider.findOneAndUpdate(
			{ zwiftId: result.zwiftId },
			{ $set: { category: categoryCurrent } }
		);

		return { category: categoryCurrent };
	} catch (error) {
		console.log(error);
	}
}
