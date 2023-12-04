const fs = require('fs');

// Day 4: How many points are the scratch cards worth in total?
// Part 1:
fs.readFile('day4input copy.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err('meow', err);
	}

	const lines = data.split('\n');
	const cardIds = [];
	const winningNumbers = [];
	const personalNumbers = [];

	lines.forEach((line) => {
		const [cardId, cardNumbersPart] = line.split(': ');
		const [winningCard, personalCard] = cardNumbersPart.split('| ');

		// Part 1: CardID
		const cardIdPart = cardId.replace(/\D/g, '');
		cardIds.push(cardIdPart);

		// Part 2: Winning Card Numbers
		const winningNumbersPart = winningCard.trim().split(/\s+/);
		winningNumbers.push(winningNumbersPart);

		// Part 3: Personal Card Numbers
		const personalNumbersPart = personalCard.trim().split(/\s+/);
		personalNumbers.push(personalNumbersPart);
	});

	let sum = 0;
	for (let i = 0; i < cardIds.length; i++) {
		const score = getScore(winningNumbers[i], personalNumbers[i]);
		sum += score;
	}
	console.log('Sum of all scores: ', sum);
});

function getScore(winningCard, personalCard) {
	let count = countMatches(winningCard, personalCard);
	let score = count ? 1 : 0;
	while (count - 2 >= 0) {
		score += score;
		count--;
	}
	return score;
}

function countMatches(winningCard, personalCard) {
	return personalCard.filter((num) => winningCard.includes(num)).length;
}
