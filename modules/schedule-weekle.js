import tJson from '../locales/ru.json' assert { type: 'json' };
export async function getScheduleWeekly(ctx) {
	try {
		return await ctx
			.replyWithHTML(
				`
<i>${tJson.schedule.events.catch.title}</i>
${tJson.schedule.events.catch.description} ${tJson.schedule.channelName} 

<i>${tJson.schedule.events.crit.title}</i>
${tJson.schedule.events.crit.description} ${tJson.schedule.channelName} 
`,
				{ disable_web_page_preview: true }
			)
			.then(message => ctx.session.data.messagesIdForDelete.push(message.message_id));
	} catch (error) {
		console.log(error);
	}
}
