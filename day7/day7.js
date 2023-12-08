const fs = require('fs');

// Day 7:
// Part 1: What are the total winnings?
fs.readFile('day7input.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err('what does the camel say', err);
	}

	const lines = data.split('\n');

	// Remove last new line
	lines.pop();

	const hands = lines.map(parseAndClassifyHand);
	const sortedHands = sortHands(hands);
	const totalWinnings = findTotalWinnings(sortedHands);
	console.log('The total winnings are: ', totalWinnings);
});

function findTotalWinnings(sortedHands) {
	let multiplier = 1;
	let winnings = 0;
	sortedHands.forEach((line) => {
		if (line) {
			// Remove hand rank
			line.pop();
			const rank = parseInt(line.join('').slice(5));
			winnings += rank * multiplier;
			multiplier++;
		}
	});
	return winnings;
}

function parseAndClassifyHand(line) {
	let cards = {};
	let numOfJokers = 0;
	const newLine = line.split(' ');
	const hand = newLine[0];

	// Part 2: New joker rules
	for (const card of hand) {
		if (card === 'J') {
			numOfJokers++;
		} else {
			if (cards[card]) {
				cards[card]++;
			} else {
				cards[card] = 1;
			}
		}
	}
	let cardTypeCounts = Object.values(cards).sort((a, b) => {
		return b - a;
	});
	if (cardTypeCounts[0]) {
		cardTypeCounts[0] += numOfJokers;
	} else {
		cardTypeCounts[0] = numOfJokers;
	}
	let handResult;
	switch (cardTypeCounts[0]) {
		case 5:
			handResult = 6;
			break;
		case 4:
			handResult = 5;
			break;
		case 3:
			handResult =
				cardTypeCounts[1] === 2 ? 4 : cardTypeCounts[1] === 1 ? 3 : 0;
			break;
		case 2:
			handResult =
				cardTypeCounts[1] === 2 ? 2 : cardTypeCounts[1] === 1 ? 1 : 0;
			break;
		default:
			handResult = 0;
	}
	return [...line, handResult];
}

function sortHands(hands) {
	const cardRankMap = {
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		T: 10,
		// Part 2
		J: 1,
		Q: 12,
		K: 13,
		A: 14,
	};

	return hands.sort((a, b) => {
		// First hand rank of A is greater
		if (a[a.length - 1] > b[b.length - 1]) {
			return 1;
			// First hand rank of A is lesser
		} else if (a[a.length - 1] < b[b.length - 1]) {
			return -1;
			// Hand ranks are the same
		} else if (a[a.length - 1] === b[b.length - 1]) {
			let card = 0;
			// Loop through until the first card that is not the same
			while (cardRankMap[a[card]] === cardRankMap[b[card]]) {
				card++;
			}
			if (cardRankMap[a[card]] > cardRankMap[b[card]]) {
				return 1;
			} else {
				return -1;
			}
		}
	});
}
