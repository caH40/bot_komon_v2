import { Series } from '../../Model/Series.js';
import { Stage } from '../../Model/Stage.js';
import { posting } from './posting.js';

export async function scheduleView(ctx, cbqData) {
	try {
		const seriesId = cbqData.slice(9);

		const stagesDB = await Stage.find({ seriesId });
		const seriesDB = await Series.findOne({ _id: seriesId });
		const title = `${seriesDB.name}, ${seriesDB.type}`;

		return posting(ctx, stagesDB, title);
	} catch (error) {
		console.log(error);
	}
}
