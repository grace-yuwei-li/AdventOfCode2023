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
	'L=>L': { dx: 0, dy: -1, newDirection: 'U' },
	'7=>U': { dx: -1, dy: 0, newDirection: 'L' },
	'J=>D': { dx: -1, dy: 0, newDirection: 'L' },
	'-=>L': { dx: -1, dy: 0, newDirection: 'L' },
	'7=>R': { dx: 0, dy: 1, newDirection: 'D' },
	'|=>D': { dx: 0, dy: 1, newDirection: 'D' },
	'F=>L': { dx: 0, dy: 1, newDirection: 'D' },
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

function convertToString(x, y) {
	return `${x}, ${y}`;
}

function main() {
	readInputFile('day10input.txt', (data) => {
		let { cells, start } = parse(data);
		let { x, y, direction } = getInitialDirection(cells, start);
		let part1answer = 1;
		let part2answer = 0;
		const loop = new Map();
		loop.set(convertToString(x, y), cells[y][x]);

		const initialDirection = direction;
		const startX = x;
		const startY = y;

		// Loop through path to find S again
		while (cells[y][x] !== 'S') {
			let result = moveAndUpdateDirection(cells, x, y, direction);
			x = result.x;
			y = result.y;
			direction = result.direction;
			part1answer++;
			loop.set(convertToString(x, y), cells[y][x]);
		}

		const finalDirection = direction;

		console.log(initialDirection, finalDirection);

		console.log(loop, 'loop here', loop.size, 'size of loop');
		if (loop.size !== part1answer) {
			console.error('abort mission');
			return;
		}

		// Convert S to regular symbol
		cells[startY][startX] = getSSymbol(initialDirection, finalDirection);

		for (let y = 0; y < cells.length; y++) {
			for (let x = 0; x < cells[y].length; x++) {
				// Check if point is inside the enclosed loop
				if (isInside(x, y, loop)) {
					// increment the answer
					part2answer++;
				}
			}
		}
		part1answer = Math.ceil((part1answer /= 2));
		console.log('Part 1 answer is:', part1answer);
		console.log('Part 2 answer is:', part2answer);
	});
}

function getSSymbol(initialDirection, finalDirection) {
	let code = initialDirection + finalDirection;
	switch (code) {
		case 'RU':
		case 'DL':
			return 'F';
		case 'LU':
		case 'DR':
			return '7';
		case 'LD':
		case 'UR':
			return 'J';
		case 'UL':
		case 'RD':
			return 'L';
		case 'UU':
		case 'DD':
			return '|';
		case 'LL':
		case 'RR':
			return '-';
		default:
			throw new Error(`unexpected code ${code}`);
	}
}

function isInside(xt, y, loop) {
	if (loop.has(convertToString(xt, y))) {
		return false;
	}

	let hitCount = 0;
	for (let x = 0; x < xt; x++) {
		const symbol = loop.get(convertToString(x, y));
		if (symbol === '|' || symbol === 'L' || symbol === 'J') {
			hitCount++;
		}
	}
	if (hitCount % 2 === 0) {
		return false;
	}
	console.log(`xt, y is inside loop`, xt, y);
	return true;
}
main();
