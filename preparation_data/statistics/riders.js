import { Result } from '../../Model/Result.js';
import { Stage } from '../../Model/Stage.js';

export async function getStatRiders() {
	try {
		const resultsDB = await Result.find({ isDidNotFinish: false });
		const stagesDB = await Stage.find({ hasResults: true });

		const quantityStages = stagesDB.length;

		const zwiftRiderId = new Set();
		resultsDB.forEach(result => {
			if (result.zwiftRiderId) zwiftRiderId.add(result.zwiftRiderId);
		});

		let statistics = [];
		zwiftRiderId.forEach(zwiftId => {
			const rider = {};
			const resultsRider = resultsDB.filter(result => result.zwiftRiderId === zwiftId);

			let timeTotal = 0;
			resultsRider.forEach(result => {
				if (result.imageSrc) rider.imageSrc = result.imageSrc;
				timeTotal += result.time;
				rider._id = result._id;
			});

			rider.name = resultsRider[0]?.name;
			rider.stages = resultsRider.length;
			rider.percentCompleted = Math.trunc((resultsRider.length / quantityStages) * 100);
			rider.timeTotal = timeTotal;
			statistics.push(rider);
		});

		statistics.sort((a, b) => b.stages - a.stages);

		return statistics;
	} catch (error) {
		console.log(error);
	}
}
