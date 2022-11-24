export async function assignCategoryRiderFromStage(ctx, cbqData) {
	try {
		const stageId = cbqData.slice(11);

		const ridersDB = await Rider.find();
		//обновление riderId в результатах, если не было
		for (let i = 0; i < ridersDB.length; i++) {
			await Result.updateMany(
				{ $and: [{ zwiftRiderId: ridersDB[i].zwiftId }, { riderId: null }] },
				{ $set: { riderId: ridersDB[i]._id } }
			);
		}

		let message = '';
		const resultDB = await Result.find({ stageId });

		for (let i = 0; i < resultDB.length; i++) {
			if (resultDB[i].riderId) {
				let riderDB = await Rider.findOne({ _id: resultDB[i].riderId });
				if (riderDB.category > resultDB[i].category) {
					let resultsForUpdateDB = await Result.updateMany(
						{ riderId: resultDB[i].riderId },
						{ $set: { category: resultDB[i].category } }
					);

					let riderDB = await Rider.findOneAndUpdate(
						{ _id: resultDB[i].riderId },
						{ $set: { category: resultDB[i].category } }
					);
				}
			} else {
				const resultsDB = await Result.updateMany(
					{
						$and: [
							{ zwiftRiderId: resultDB[i].zwiftRiderId },
							{ category: { $gt: resultDB[i].categoryCurrent } },
						],
					},
					{ $set: { category: resultDB[i].categoryCurrent } },
					{ returnDocument: 'after' }
				);
			}
		}

		// message += `${riderUpdated.lastName} ${riderUpdated.firstName} новая группа ${riderUpdated.category}\n`;

		// await ctx.reply(message);
		await ctx.reply('Категории обновились');
	} catch (error) {
		console.log(error);
	}
}
