import 'dotenv/config';
import { session, Telegraf } from 'telegraf';
import mongoose from 'mongoose';

// import { start } from './controllers/start.js';
// import { help } from './controllers/help.js';
// import { mainMenu } from './controllers/main.js';
// import { callbackQuery } from './controllers/callback-query.js';
// import { filterMessage } from './middleware/filter-message.js';
// import { activationScenes } from './scenes/activation-scenes.js';
// import { countClick } from './middleware/count-click.js';
// import { getClicks } from './controllers/clicks.js';
// import { nodeSchedule } from './modules/node-schedule.js';
import { serverExpress } from './server/server.js';
// import { readChannelPosts } from './modules/channel.js';
// import { sendNotice } from './controllers/notice-post.js';

await mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log('Connected to Mongo..'))
  .catch((error) => console.log(error));

await serverExpress().catch((error) => console.log(error));

const bot = new Telegraf(process.env.BOT_TOKEN);

// const stage = activationScenes();

// bot.use(session());
// bot.use(stage.middleware());
// bot.use(filterMessage);
// bot.use(countClick);

// bot.command('start', async (ctx) => await start(ctx));
// bot.command('help', async (ctx) => await help(ctx));
// bot.command('main', async (ctx) => await mainMenu(ctx));
// bot.command('click', async (ctx) => await getClicks(ctx));
// bot.on('callback_query', async (ctx) => await callbackQuery(ctx));
// bot.on('channel_post', async (ctx) => await readChannelPosts(ctx, ctx.update.channel_post));
// bot.on('message', async (ctx) => await sendNotice(ctx));

// bot.launch().then(nodeSchedule());
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
