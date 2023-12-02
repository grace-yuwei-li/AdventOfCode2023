const fs = require("fs");

// Day 1: What is the sum of all the possible game IDs?
// Part 1:
function processGame(line) {
	const gamePattern = /(\d+): (.+)/;

	const match = line.match(gamePattern);
	if (!match) {
		return null;
	}

	const gameID = match[1];
	const rounds = match[2].split(";").filter(Boolean);

	let maxCount = { red: 0, green: 0, blue: 0 };

	rounds.forEach((round) => {
		const items = round.trim().split(", ");

		items.forEach((item) => {
			const parts = item.split(" ");
			const count = parseInt(parts[0], 10);
			const color = parts[1].toLowerCase();
			maxCount[color] = Math.max(maxCount[color], count);
		});
	});

	const limit = {
		red: 12,
		green: 13,
		blue: 14,
	};

	const limitExceeded = Object.entries(maxCount).some(([color, count]) => {
		return count > limit[color];
	});

	return { gameID, limitExceeded };
}

fs.readFile("day2input.txt", "utf-8", (err, data) => {
	if (err) {
		console.error("uh oh file is weird and cant really be read", err);
		return;
	}

	const lines = data.split("\n");
	const games = lines
		.map((line) => processGame(line))
		.filter((game) => game !== null);
	games.forEach((game) => {
		console.log(`Game ${game.gameID} exceeds limits: ${game.limitExceeded}`);
	});

	const possibleIDs = games
		.filter((game) => !game.limitExceeded)
		.map((game) => parseInt(game.gameID, 10));

	const sum = possibleIDs.reduce((sum, id) => (sum += id), 0);

	console.log("Result IDs", possibleIDs);
	console.log("Sum", sum);
});
