import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

export async function getChartClicks(label, labels, data) {
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
						backgroundColor: '#1ec1aa',
						borderWidth: 1,
						fill: 'start',
						tension: 0.4,
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
						text: 'Активность в боте ZwiftRaceInfo',
						font: {
							size: 14,
							family: 'sans-serif',
						},
					},
					legend: {
						position: 'bottom',
						labels: {
							boxHeight: 5,
							padding: 5,
							textAlign: 'right',
							font: {
								size: 14,
								family: 'sans-serif',
							},
						},
					},
				},
			},
		};

		const base64Image = await chartJSNodeCanvas.renderToDataURL(configuration);
		return base64Image;
	} catch (error) {
		console.log(error);
	}
}
