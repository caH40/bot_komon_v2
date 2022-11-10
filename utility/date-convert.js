export function convertDate(date, time = '00:00') {
	try {
		const millisecondsInHour = 3600000;
		const millisecondsInMinute = 60000;

		const timeArr = time.split(':');
		const timeMilliseconds = timeArr[0] * millisecondsInHour + timeArr[1] * millisecondsInMinute;

		const dateArr = date.split('.');
		const dateNewFormat = [dateArr[1], dateArr[0], dateArr[2]].join('.');

		const dateMilliseconds = new Date(dateNewFormat).getTime() + timeMilliseconds;

		return dateMilliseconds;
	} catch (error) {
		console.log(error);
	}
}
//строку в милисекунды
export function convertTime(time = '00:00') {
	try {
		const millisecondsInHour = 3600000;
		const millisecondsInMinute = 60000;

		const timeArr = time.split(':');
		if (timeArr.length === 3) {
			return (
				timeArr[0] * millisecondsInHour + timeArr[1] * millisecondsInMinute + timeArr[2] * 1000
			);
		}
		if (timeArr.length === 2) {
			return timeArr[0] * millisecondsInMinute + timeArr[1] * 1000;
		}
	} catch (error) {
		console.log(error);
	}
}
export function secondesToTime(seconds) {
	seconds = seconds / 1000;
	if (seconds > 3599) {
		const hour = Math.trunc(seconds / 3600);
		const minutes = Math.trunc((seconds - hour * 3600) / 60);
		const second = Math.trunc(seconds - hour * 3600 - minutes * 60);

		return `${addNull(hour)}:${addNull(minutes)}:${addNull(second)}`;
	}
	if (seconds < 3600) {
		const minutes = Math.trunc(seconds / 60);
		const second = Math.trunc(seconds - minutes * 60);
		return `${addNull(minutes)}:${addNull(second)}`;
	} else {
		return seconds;
	}
}
export function secondesToTimeThousandths(seconds) {
	if (seconds > 3599000) {
		const hour = Math.trunc(seconds / 3600000);
		const minutes = Math.trunc((seconds - hour * 3600000) / 60000);
		const second = Math.trunc((seconds - hour * 3600000 - minutes * 60000) / 1000);
		const milliseconds = seconds - hour * 3600000 - minutes * 60000 - second * 1000;
		return `${addNull(hour)}:${addNull(minutes)}:${addNull(second)}.${milliseconds}`;
	}
	if (seconds < 3600000) {
		const minutes = Math.trunc(seconds / 60000);
		const second = Math.trunc((seconds - minutes * 60000) / 1000);
		const milliseconds = seconds - minutes * 60000 - second * 1000;
		return `${addNull(minutes)}:${addNull(second)}.${milliseconds}`;
	} else {
		return seconds;
	}
}
function addNull(number) {
	number = String(number);
	if (number.length === 1) {
		return '0' + number;
	}
	if (number.length === 2) {
		return number;
	} else {
		return number;
	}
}
