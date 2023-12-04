const fs = require('fs');

// Day 3: What is the sum of all of the part numbers in the engine schematic?
// Part 1:
fs.readFile('day3input.txt', 'utf-8', (err, data) => {
	if (err) {
		console.log('at this point this is the least of my worries');
		return;
	}

	const lines = data.split('\n');
	const symbolsToCheck = '*&#$@/=%+-';
	const adjacentNumbersMap = new Map();
	let sum = 0;

	lines.forEach((line, rowIdx) => {
		for (let colIdx = 0; colIdx < line.length; colIdx++) {
			const char = line[colIdx];

			if (symbolsToCheck.includes(char)) {
				for (let i = -1; i <= 1; i++) {
					for (let j = -1; j <= 1; j++) {
						const newRow = rowIdx + i;
						const newCol = colIdx + j;

						if (
							newRow >= 0 &&
							newRow < lines.length &&
							newCol >= 0 &&
							newCol < line.length
						) {
							let adjacentChar = lines[newRow][newCol];

							if (!isNaN(parseInt(adjacentChar))) {
								let k = newCol - 1;

								while (!isNaN(lines[newRow][k])) {
									if (!isNaN(parseInt(lines[newRow][k]))) {
										adjacentChar = lines[newRow][k] + adjacentChar;
									}
									k--;
								}
								k = newCol + 1;

								while (!isNaN(lines[newRow][k])) {
									if (!isNaN(parseInt(lines[newRow][k]))) {
										adjacentChar = adjacentChar + lines[newRow][k];
									}
									k++;
								}

								const key = `${char}-${rowIdx}-${colIdx}-${adjacentChar}`;

								if (!adjacentNumbersMap.has(key)) {
									const adjacentNumberValue = parseInt(adjacentChar);
									sum += adjacentNumberValue;
									adjacentNumbersMap.set(key, {
										symbol: char,
										row: rowIdx,
										col: colIdx,
										adjacentNumber: adjacentChar,
									});
								}
							}
						}
					}
				}
			}
		}
	});

	console.log('Sum of all adjacent numbers: ', sum);
});
