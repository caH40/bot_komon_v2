import { Stage } from '../../Model/Stage.js';

export async function getStages(series) {
	try {
		const stagesDB = await Stage.find({ seriesId: series }).populate({
			path: 'seriesId',
			select: 'name',
		});
		return stagesDB;
	} catch (err) {
		console.log(err);
	}
}
