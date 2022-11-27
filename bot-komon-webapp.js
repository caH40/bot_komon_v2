import 'dotenv/config';
import { session, Telegraf } from 'telegraf';
import mongoose from 'mongoose';

import { start } from './controllers/start.js';
import { help } from './controllers/help.js';
import { mainMenu } from './controllers/main.js';
import { callbackQuery } from './controllers/callback-query.js';
import { filterMessage } from './middleware/filter-message.js';
import { activationScenes } from './scenes/activation-scenes.js';
import { countClick } from './middleware/count-click.js';
import { getClicks } from './controllers/clicks.js';
import { nodeSchedule } from './modules/node-schedule.js';
import { serverExpress } from './server/server.js';
import { readChannelPosts } from './modules/channel.js';
// import axios from 'axios';
// import { Team } from './Model/Team.js';

await mongoose
	.connect(process.env.MONGODB)
	.then(() => console.log('Connected to Mongo..'))
	.catch(error => console.log(error));

await serverExpress().catch(error => console.log(error));

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = activationScenes();

bot.use(session());
bot.use(stage.middleware());
bot.use(filterMessage);
bot.use(countClick);

bot.command('start', async ctx => await start(ctx));
bot.command('help', async ctx => await help(ctx));
bot.command('main', async ctx => await mainMenu(ctx));
bot.command('click', async ctx => await getClicks(ctx));
// bot.on('photo', async ctx => {
// 	const fileId90 = ctx.update.message.photo[0].file_id;
// 	const fileInTelegram = await ctx.telegram.getFile(fileId90);
// 	console.log(fileInTelegram.file_path.split('.')[1]);
// 	const photoBuffer = await axios.get(
// 		`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileInTelegram.file_path}`,
// 		{ responseType: 'arraybuffer' }
// 	);
// 	const b = Buffer.from(photoBuffer.data, 'binary').toString('base64');
// 	await Team.findOneAndUpdate({ _id: '638252fa005e493bde24ea45' }, { $set: { logoBase64: b } });
// });
bot.on('callback_query', async ctx => await callbackQuery(ctx));
bot.on('channel_post', async ctx => await readChannelPosts(ctx, ctx.update.channel_post));

bot.launch().then(nodeSchedule());

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
