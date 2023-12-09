const fs = require('fs');

// Day 9:
// Part 1: What is the sum of these extrapolated values?
fs.readFile('day9input.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err('i am innumerate', err);
	}

	const lines = data.split(/\r?\n/);
	const nums = lines.map((line) => line.split(' ').map((num) => parseInt(num)));

	const histories = nums.map(processNums);
	let result = histories.reduce((acc, curr) => acc + curr, 0);

	console.log('The sum of the extrapolated values is: ', result);
});

function processNums(line) {
	const nextLines = new Array(line);
	let curr = line;
	while (true) {
		const next = curr.slice(1).map((value, index) => value - curr[index]);
		nextLines.push(next);
		if (next.some((value) => value !== 0)) {
			curr = next;
		} else {
			break;
		}
	}

	const sequences = nextLines.reverse();
	for (let i = 0; i < sequences.length - 1; i++) {
		const sum =
			sequences[i][sequences[i].length - 1] +
			sequences[i + 1][sequences[i + 1].length - 1];
		sequences[i + 1].push(sum);
	}
	return sequences.pop().pop();
}
