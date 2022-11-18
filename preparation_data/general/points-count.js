export function countPoints(ridersChecked) {
	try {
		ridersChecked.forEach(rider => {
			let points = 0;
			let stagesCurrentType = [];

			stagesCurrentType = rider.pointsStage.filter(stage => stage.type === 'TT');
			if (stagesCurrentType.length === 1) points += stagesCurrentType[0].points;
			if (stagesCurrentType.length === 2) {
				if (stagesCurrentType[0].points > stagesCurrentType[1].points) {
					points += stagesCurrentType[0].points;
				} else {
					points += stagesCurrentType[1].points;
				}
			}

			stagesCurrentType = rider.pointsStage.filter(stage => stage.type === 'mountain');
			if (stagesCurrentType.length === 1) points += stagesCurrentType[0].points;
			if (stagesCurrentType.length === 2) {
				if (stagesCurrentType[0].points > stagesCurrentType[1].points) {
					points += stagesCurrentType[0].points;
				} else {
					points += stagesCurrentType[1].points;
				}
			}

			stagesCurrentType = rider.pointsStage.filter(stage => stage.type === 'mixed');
			if (stagesCurrentType.length === 1) points += stagesCurrentType[0].points;
			if (stagesCurrentType.length === 2) {
				if (stagesCurrentType[0].points > stagesCurrentType[1].points) {
					points += stagesCurrentType[0].points;
				} else {
					points += stagesCurrentType[1].points;
				}
			}
			rider.pointsTotal = points;
		});

		return ridersChecked;
	} catch (error) {
		console.log(error);
	}
}
