const fs = require('fs');

// Day 6:
// Part 1: What do you get if you multiply the number of ways you can beat
// the record in each race
fs.readFile('day6input.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err('vroom vroom');
	}

	const lines = data.split('\n');
	const timePart = lines[0].split(/\s+/);
	const distancePart = lines[1].split(/\s+/);

	const times = timePart.slice(1).map(Number);
	const distances = distancePart.slice(1).map(Number);

	// Part 2: Longer race with one time and distance
	const time = parseInt(timePart.slice(1).join(''));
	const distance = parseInt(distancePart.slice(1).join(''));

	let product = 1;
	for (let i = 0; i < times.length; i++) {
		product *= numOfWaysToWin(times[i], distances[i]);
	}
	const numOfWaysToBeatRecord = numOfWaysToWin(time, distance);

	console.log('Product of number of ways to win is: ', product);
	console.log('Number of ways to beat the record is: ', numOfWaysToBeatRecord);
});

function numOfWaysToWin(raceTime, recordTime) {
	let lossCounts = 0;
	let pressTime = 0;

	while (pressTime * (raceTime - pressTime) <= recordTime) {
		lossCounts++;
		pressTime++;
	}
	return raceTime - lossCounts * 2 + 1;
}
