import fs from 'fs';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Click } from '../Model/Click.js';
import path from 'path';
const __dirname = path.resolve();

export async function getClicks(ctx) {
	try {
		const telegramId = ctx.message.from.id;

		const clicksDB = await Click.find();

		const millisecondsInDay = 84000000;

		let day = new Date().setHours(0, 0, 0, 0);
		let labels = [];

		for (let i = 0; i < 20; i++) {
			labels.push(new Date(day).setHours(0, 0, 0, 0));
			day -= millisecondsInDay;
		}
		const data = [];
		// labels = labels.reverse();

		labels.forEach(day => {
			let clicksInDay = 0;
			clicksDB.forEach(user => {
				user.clicksPerDay.forEach(clicks => {
					if (day === clicks.date) {
						clicksInDay += clicks.clicks;
					}
				});
			});
			data.push(clicksInDay);
		});

		let label = 'Количество кликов за день:\n';

		labels.forEach(
			(day, index) => (day = labels[index] = new Date(day).toLocaleDateString()?.slice(0, 5))
		);

		getImage(label, labels, data, ctx, telegramId);
	} catch (error) {
		console.log(error);
	}
}

async function getImage(label, labels, data, ctx, telegramId) {
	try {
		const width = 600;
		const height = 300;
		const backgroundColour = '#FFFFFF';
		const chartJSNodeCanvas = new ChartJSNodeCanvas({
			width,
			height,
			backgroundColour,
		});

		const configuration = {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label,
						data,
						backgroundColor: 'teal',
						barThickness: 15,
						borderWidth: 1,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
				plugins: {
					title: {
						display: true,
						text: 'Активность в боте ZwiftRaceInfo_bot',
						font: {
							size: 14,
							family: 'sans-serif',
						},
					},
					legend: {
						labels: {
							font: {
								size: 14,
								family: 'sans-serif',
							},
						},
					},
				},
			},
		};

		const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
		const base64Image = dataUrl;

		var base64Data = base64Image.replace(/^data:image\/png;base64,/, '');

		const pathSrc = path.resolve(__dirname, './src/images', `click-${telegramId}.png`);

		fs.writeFileSync(pathSrc, base64Data, 'base64');
		await ctx.replyWithPhoto({
			source: pathSrc,
		});
	} catch (error) {
		console.log(error);
	}
}
