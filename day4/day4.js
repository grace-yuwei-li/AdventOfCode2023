const fs = require('fs');

// Day 4
// Part 1: How many points are the scratch cards worth in total?
fs.readFile('day4input.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err('meow', err);
	}

	const lines = data.split('\n');
	const cardIds = [];
	const winningNumbers = [];
	const personalNumbers = [];
	const numOfCardsMap = new Map();

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
		numOfCardsMap.set(parseInt(cardIds[i]), 1);
	}
	console.log('Sum of all scores: ', sum);

	// Part 2: How many total scratchcards do you end up with?
	for (let i = 0; i < cardIds.length; i++) {
		setNumOfCardsMap(
			numOfCardsMap,
			cardIds[i],
			winningNumbers[i],
			personalNumbers[i]
		);
	}

	let numOfCards = 0;
	numOfCardsMap.forEach((value) => {
		numOfCards += value;
	});
	console.log(`Number of total cards: `, numOfCards);
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

function setNumOfCardsMap(numOfCardsMap, cardId, winningCard, personalCard) {
	const count = countMatches(winningCard, personalCard);
	let numOfCards = count;
	let tempCardId = parseInt(cardId) + 1;

	while (numOfCards > 0) {
		numOfCardsMap.set(
			tempCardId,
			numOfCardsMap.get(tempCardId) + 1 * numOfCardsMap.get(parseInt(cardId))
		);
		numOfCards--;
		tempCardId++;
	}
}
