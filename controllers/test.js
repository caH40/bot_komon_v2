import fs from 'fs';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Click } from '../Model/Click.js';

export async function test() {
	try {
		const clicksDB = await Click.find();

		const millisecondsInDay = 84000000;

		let dayForTotal = new Date().getTime() - millisecondsInDay;
		const total = {};

		for (let i = 0; i < 30; i++) {
			total[new Date(dayForTotal).toLocaleDateString()] = 0;
			dayForTotal -= millisecondsInDay;
		}

		clicksDB.forEach(user => {
			user.clicksPerDay.forEach(clicks => {
				let day = new Date().getTime() - millisecondsInDay;
				for (let i = 0; i < 30; i++) {
					if (new Date(clicks.date).toLocaleDateString() === new Date(day).toLocaleDateString()) {
						total[new Date(clicks.date).toLocaleDateString()] += clicks.clicks;
					}
					day -= millisecondsInDay;
				}
			});
		});
		console.log(total);
		let label = 'Количество кликов за день:\n';
		const labels = Object.keys(total);
		const data = [];
		labels.forEach(key => data.push(total[key]));
		getImage(label, labels, data);
	} catch (error) {
		console.log(error);
	}
}

async function getImage(label, labels, data) {
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

		fs.writeFile('out.png', base64Data, 'base64', function (err) {
			if (err) {
				console.log(err);
			}
		});
		return dataUrl;
	} catch (error) {
		console.log(error);
	}
}
