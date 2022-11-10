import { Result } from '../../Model/Result.js';
import { Rider } from '../../Model/Rider.js';
import { Team } from '../../Model/Team.js';
import { posting } from './posting.js';

export async function listRiders(ctx, cbqData) {
	try {
		const teamName = cbqData.slice(9);

		//populate, что бы узнать id капитана
		const teamDB = await Team.findOne({ name: teamName }).populate('riders.rider');

		const ridersDB = await Rider.find({ teamId: teamDB._id });
		const riders = [];

		for (let i = 0; i < ridersDB.length; i++) {
			//поиск всех результатов и их подсчет
			let quantityResults = await Result.find({ riderId: ridersDB[i]._id });

			let rider = {
				quantityResults: (quantityResults.length ??= 0),
				sequence: String(i + 1),
				teamName: teamDB.name,
				lastName: ridersDB[i].lastName,
				firstName: ridersDB[i].firstName,
			};

			if (ridersDB[i]._id.toString() === teamDB.riders[0].rider._id.toString())
				rider.capitan = true;
			riders.push(rider);
		}

		return await posting(ctx, riders);
	} catch (error) {
		console.log(error);
	}
}
