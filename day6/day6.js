const fs = require('fs');

// Day 6:
// Part 1: What do you get if you multiply the number of ways you can beat
// the record in each race
fs.readFile('day6input.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err('vroom vroom');
	}

	const lines = data.split('\n');
	const part1 = lines[0].split(/\s+/);
	const part2 = lines[1].split(/\s+/);
	const times = part1.slice(1).map(Number);
	const distances = part2.slice(1).map(Number);

	let product = 1;
	for (let i = 0; i < times.length; i++) {
		product *= numOfWaysToWin(times[i], distances[i]);
	}
	console.log('Product of number of ways to win is: ', product);
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
