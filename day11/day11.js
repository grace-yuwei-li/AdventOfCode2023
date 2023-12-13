const fs = require('fs');

// Day 11:
// Part 1: What is the sum of the lengths of the shortest path
// between all pairs of galaxies?
function readInputFile(filename, callback) {
	fs.readFile(filename, 'utf-8', (err, data) => {
		if (err) {
			console.err('space');
		} else {
			callback(data);
		}
	});
}

function parseData(data) {
	const lines = data.split(/\r?\n+/);
	const galaxies = [];
	const emptyRow = new Array(lines.length).fill(true);
	const emptyCol = new Array(lines[0].length).fill(true);
	lines.forEach((row, y) => {
		row.split('').forEach((symbol, x) => {
			if (symbol === '#') {
				galaxies.push({ x, y });
				emptyRow[y] = false;
				emptyCol[x] = false;
			}
		});
	});
	return { galaxies, emptyRow, emptyCol };
}

function expandSpace(galaxies, offset, emptyRow, emptyCol) {
	const newCols = [];
	const newRows = [];
	emptyRow.forEach((x, col) => {
		if (x) newCols.push(col);
	});
	emptyCol.forEach((y, row) => {
		if (y) newRows.push(row);
	});
	for (const galaxy of galaxies) {
		let deltaY = newCols.filter((y) => y < galaxy.y).length;
		let deltaX = newRows.filter((x) => x < galaxy.x).length;
		galaxy.x += deltaX * offset;
		galaxy.y += deltaY * offset;
	}
	return galaxies;
}

function manhattanDistance(start, end) {
	return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

function sumAllDistances(galaxies) {
	let sum = 0;
	for (let i = 0; i < galaxies.length - 1; i++) {
		for (let j = i + 1; j < galaxies.length; j++) {
			let distance = manhattanDistance(galaxies[i], galaxies[j]);
			sum += distance;
		}
	}
	return sum;
}

function main() {
	readInputFile('day11input.txt', (data) => {
		const offset = 999999;
		const { galaxies, emptyRow, emptyCol } = parseData(data);
		const expandedSpace = expandSpace(galaxies, offset, emptyRow, emptyCol);

		const answer = sumAllDistances(expandedSpace);
		console.log(
			'The sum of the shortest paths between all galaxies is',
			answer
		);
	});
}

main();
