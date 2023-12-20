const fs = require('fs');

// Day 13:
// What number do you get after summarizing all of the notes?
function readInputFile(filename, callback) {
	fs.readFile(filename, 'utf-8', (err, data) => {
		if (err) {
			console.err('space');
		} else {
			callback(data);
		}
	});
}

function countRows(note, horizontalReflection = true) {
	for (let i = 0; i < note.length - 1; i++) {
		if (note[i] === note[i + 1]) {
			let topRow = i;
			let bottomRow = i + 1;

			while (
				topRow >= 0 &&
				bottomRow < note.length &&
				note[topRow] === note[bottomRow]
			) {
				topRow--;
				bottomRow++;
			}

			if (topRow < 0 || bottomRow >= note.length) {
				return horizontalReflection ? 100 * (i + 1) : i + 1;
			}
		}
	}

	return 0;
}

function parseCols(note) {
	let cols = [];

	for (let i = 0; i < note[0].length; i++) {
		const leftCol = note.map((row) => row[i]).join('');
		cols.push(leftCol);
	}

	return cols;
}

function main() {
	readInputFile('day13input.txt', (data) => {
		const notes = data.split(/\n\n/).map((line) => line.split(/\r?\n/));

		let sum = 0;
		notes.forEach(
			(note) => (sum += countRows(note) + countRows(parseCols(note), false))
		);

		console.log('The number after summarizing all notes is:', sum);
	});
}

main();
