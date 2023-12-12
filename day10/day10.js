const fs = require('fs');

// Day 10:
// Part 1: How many steps along the loop does it take to get from the
// starting position to the point farthest from the starting position?
function readInputFile(filename, callback) {
	fs.readFile(filename, 'utf-8', (err, data) => {
		if (err) {
			console.log('parsing is the bane of my existence');
		} else {
			callback(data);
		}
	});
}

function parse(data) {
	const lines = [
		'.'.repeat(data.split(/\r?\n/)[0].length),
		...data.split(/\r?\n/),
		'.'.repeat(data.split(/\r?\n/)[0].length),
	];

	let cells = [];
	let start = [0, 0];

	for (let y = 0; y < lines.length; y++) {
		let line = '.' + lines[y] + '.';
		cells.push(line.split(''));
		if (line.indexOf('S') !== -1) {
			start = [y, line.indexOf('S')];
		}
	}

	return { cells, start };
}

// Mappings for directions and next moves
const nextMoveMap = {
	'F=>U': { dx: 1, dy: 0, newDirection: 'R' },
	'-=>R': { dx: 1, dy: 0, newDirection: 'R' },
	'L=>D': { dx: 1, dy: 0, newDirection: 'R' },
	'|=>U': { dx: 0, dy: -1, newDirection: 'U' },
	'J=>R': { dx: 0, dy: -1, newDirection: 'U' },
	'L=>W': { dx: 0, dy: -1, newDirection: 'U' },
	'7=>U': { dx: -1, dy: 0, newDirection: 'W' },
	'J=>D': { dx: -1, dy: 0, newDirection: 'W' },
	'-=>W': { dx: -1, dy: 0, newDirection: 'W' },
	'7=>R': { dx: 0, dy: 1, newDirection: 'D' },
	'|=>D': { dx: 0, dy: 1, newDirection: 'D' },
	'F=>W': { dx: 0, dy: 1, newDirection: 'D' },
};

function getInitialDirection(cells, start) {
	let x = start[1];
	let y = start[0];
	let direction = 'X';

	if (['F', '7', '|'].includes(cells[y - 1][x])) {
		direction = 'U';
		y--;
	} else if (['-', '7', 'J'].includes(cells[y][x + 1])) {
		direction = 'R';
		x++;
	} else if (['|', 'L', 'J'].includes(cells[y + 1][x])) {
		direction = 'D';
		y++;
	}

	return { x, y, direction };
}

function move(x, y, nextMove) {
	const { dx, dy } = nextMoveMap[nextMove] || { dx: 0, dy: 0 };
	return { x: x + dx, y: y + dy };
}

function updateDirection(direction, nextMove) {
	return nextMoveMap[nextMove] ? nextMoveMap[nextMove].newDirection : direction;
}

function moveAndUpdateDirection(cells, x, y, direction) {
	const next = cells[y][x];
	const nextMove = next + '=>' + direction;

	const { x: newX, y: newY } = move(x, y, nextMove);
	const newDirection = updateDirection(direction, nextMove);

	return { x: newX, y: newY, direction: newDirection };
}

function main() {
	readInputFile('day10input.txt', (data) => {
		let { cells, start } = parse(data);
		let { x, y, direction } = getInitialDirection(cells, start);
		let answer = 1;

		// Loop through path to find S again
		while (cells[y][x] !== 'S') {
			let result = moveAndUpdateDirection(cells, x, y, direction);
			x = result.x;
			y = result.y;
			direction = result.direction;
			answer++;
		}

		answer = Math.ceil((answer /= 2));
		console.log('The answer is:', answer);
	});
}

main();
