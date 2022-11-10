import schedule from 'node-schedule';
import { countClicksPerDay } from './clicksperday.js';

export function nodeSchedule() {
	try {
		const rule = new schedule.RecurrenceRule();
		// rule.dayOfWeek = [0, new schedule.Range(4, 6)];
		rule.hour = 22;
		rule.minute = 57;

		schedule.scheduleJob(rule, countClicksPerDay);
	} catch (error) {
		console.log(error);
	}
}

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
