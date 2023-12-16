const fs = require('fs');

// Day 12:
// What is the sum of the counts of all different arrangements?
function readInputFile(filename, callback) {
	fs.readFile(filename, 'utf-8', (err, data) => {
		if (err) {
			console.err('yum');
		} else {
			callback(data);
		}
	});
}

// Part 1 functions:
function isValid(possibleArr, groupings) {
	let grouping = 0;
	let damageCount = 0;
	let isValid = true;

	for (let i = 0; i < possibleArr.length + 1; i++) {
		// Keep incrementing damage count until end of grouping
		if (possibleArr[i] === '#') damageCount++;
		// If damage count is not 0, but group is invalid, means inconsitency
		else if (damageCount) {
			if (!isValidGrouping(grouping++, groupings, damageCount)) {
				isValid = false;
				break;
			}
			// Reset damage count for next grouping
			damageCount = 0;
		}
	}
	// Check that all groupings have been accounted for
	return isValid && grouping === groupings.length;
}

// Sub grouping
function isValidGrouping(grouping, groupings, count) {
	return count === groupings[grouping];
}

function generatePossibilities(symbols, index, bitMask) {
	let tmpArr = [...symbols];
	let tmpMask = bitMask;
	// If least sig bit is set, replace with '#'
	for (let i = 0; i < index.length; i++) {
		tmpArr[index[i]] = tmpMask % 2 ? '#' : '.';
		tmpMask = Math.floor(tmpMask / 2);
	}
	return tmpArr;
}

function countPossibleCombinations(rows) {
	// Iterate through rows and count possibilities
	return rows.reduce((acc, { symbols, index, groupings }) => {
		let possibleCount = 0;
		// Find all possible combinations through bitmasking
		for (let bitMask = 0; bitMask < 2 ** index.length; bitMask++) {
			let possibleArr = generatePossibilities(symbols, index, bitMask);
			if (isValid(possibleArr, groupings)) possibleCount++;
		}
		return acc + possibleCount;
	}, 0);
}

function parseLine(line) {
	// Split the symbols and the groups:
	// symbols: #.#.### | groupings: 1, 1, 3
	const [symbols, groupings] = line.split(' ');

	return {
		symbols: symbols.split(''),
		// Find the position of the unknown springs
		index: Array.from(symbols.matchAll(/\?/g)).map((n) => n.index),
		groupings: groupings.split(',').map((n) => parseInt(n)),
	};
}

// Part 2 functions:
function parseCopies(line, scale) {
	let [row, groupings] = line.split(' ');
	return {
		// This makes scale copies of the same row, and joins it with '?'
		row: Array.from({ length: scale }, () => row)
			.join('?')
			.split(''),
		// Same concept for groupings without the join, and flatten groupings
		groupings: Array.from({ length: scale }, () =>
			groupings.split(',').map((n) => parseInt(n))
		).flat(),
	};
}

function initializeDPTable(x, y, z) {
	// Create a 3D array with dimensions (x + 1) x (y + 1) x (z + 1)
	// filled with zeros, we add 1 to pad values with proper indices
	return Array.from({ length: x + 1 }, () =>
		Array.from({ length: y + 1 }, () => Array.from({ length: z + 1 }, () => 0))
	);
}

function countArrangements(arrangements, factor) {
	// Return a dp table value for each possible arrangement
	return arrangements.reduce((acc, line) => {
		let { row, groupings } = parseCopies(line, factor);
		const x = row.length;
		const y = groupings.length;
		const z = Math.max(...groupings);

		let dp = initializeDPTable(x, y, z);
		dp = dpBaseCases(dp, row);
		dp = dpSubRoutines(dp, row, groupings);

		// Add value for the specific row that is being computed, value is
		// always the last calculated row, column, and grouping in the sub table
		return acc + dp[x][y][0] + dp[x][y - 1][groupings[y - 1]];
	}, 0);
}

function dpBaseCases(dp, row) {
	let damageCount = 0;

	// Kick start the DP table, there are no characters in the row yet
	dp[0][0][0] = 1;

	// Iterate over each symbol and check consecutive damage count,
	// set to 1 to mark it as a valid arrangement if damage count exists
	for (let i = 1; i <= row.length; i++) {
		row[i - 1] === '#' ? damageCount++ : (damageCount = 0);
		if (damageCount) {
			dp[i][0][damageCount] = 1;
		}
	}

	// Check for non damaged symbols and mark as valid arrangement
	for (let i = 1; i <= row.length; i++) {
		if (row[i - 1] === '#') {
			break;
		} else {
			dp[i][0][0] = 1;
		}
	}
	return dp;
}

function dpSubRoutines(dp, row, groupings) {
	for (let i = 1; i <= row.length; i++) {
		// Check if the spring is undamaged, update table to add counts
		if (row[i - 1] === '.') {
			for (let j = 1; j <= groupings.length; j++) {
				dp[i][j][0] = dp[i - 1][j - 1][groupings[j - 1]] + dp[i - 1][j][0];
			}
			// Else if spring is damaged, iterate through combinations and set table
		} else if (row[i - 1] === '#') {
			for (let j = 0; j <= groupings.length; j++) {
				for (let k = 0; k < Math.max(...groupings); k++) {
					dp[i][j][k + 1] = dp[i - 1][j][k];
				}
			}
		} else {
			// Spring is unknown, loop through groupings and update tables
			for (let j = 1; j <= groupings.length; j++) {
				dp[i][j][0] = dp[i - 1][j - 1][groupings[j - 1]] + dp[i - 1][j][0];
			}

			// Update possible combinations within each groupings
			for (let j = 0; j <= groupings.length; j++) {
				for (let k = 0; k < Math.max(...groupings); k++) {
					dp[i][j][k + 1] = dp[i - 1][j][k];
				}
			}
		}
	}
	return dp;
}

function main() {
	readInputFile('day12input.txt', (data) => {
		const lines = data.split(/\r?\n/);

		// Part 1: Brute forcing strategy
		const parsedLines = lines.map(parseLine);
		const answer1 = countPossibleCombinations(parsedLines);
		console.log('The sum of possible arrangements for part 1 is: ', answer1);

		// Part 2: 3D Array DP Bottom Up, works for Part 1 as well: set copies to 1
		const copies = 5;
		const answer2 = countArrangements(lines, copies);
		console.log('The sum of possible arrangements for part 2 is: ', answer2);
	});
}

main();
