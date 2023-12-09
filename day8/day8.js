const fs = require('fs');

// Day 8:
// Part 1: How many steps are required to reach ZZZ?
fs.readFile('day8input.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', err);
	}

	const lines = data.split('\n');
	const startNode = 'AAA';
	const endNode = 'ZZZ';
	const sequence = lines[0];

	// Parse nodes
	const nodes = new Map();
	lines.slice(2).forEach((line) => {
		const nodeLabel = line.substring(0, 3);
		const leftNode = line.substring(7, 10);
		const rightNode = line.substring(12, 15);
		nodes.set(nodeLabel, { nodeLabel, leftNode, rightNode });
	});

	let moves = 0;
	let idx = 0;
	let currNode = startNode;
	while (currNode !== endNode) {
		const { leftNode, rightNode } = nodes.get(currNode);
		if (sequence[idx] === 'L') {
			currNode = leftNode;
		} else if (sequence[idx] === 'R') {
			currNode = rightNode;
		}
		moves++;
		idx = (idx + 1) % sequence.length;
	}

	console.log('Number of steps required: ', moves);
});
