const fs = require('fs');

// Day 8:
// Part 1: How many steps are required to reach ZZZ?
fs.readFile('day8input.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', err);
	}

	const lines = data.split('\n');
	const sequence = lines[0];

	// Parse nodes
	const nodes = new Map();
	const nodes2 = [];
	lines.slice(2).forEach((line) => {
		const nodeLabel = line.substring(0, 3);
		const leftNode = line.substring(7, 10);
		const rightNode = line.substring(12, 15);
		nodes.set(nodeLabel, { nodeLabel, leftNode, rightNode });
		if (nodeLabel.endsWith('A')) {
			nodes2.push(nodeLabel);
		}
	});

	// Part 2: Calculate paths for all nodes ending in A to
	// all nodes ending in Z
	let cycleLengths = [];
	for (let i = 0; i < nodes2.length; i++) {
		const pathLenth = computePath(nodes2[i], sequence, nodes);
		cycleLengths.push(pathLenth);
	}

	const result = computePath('AAA', sequence, nodes);
	const result2 = lcm(cycleLengths);
	console.log('Number of steps required: ', result);
	console.log('Number of steps required as a ghost: ', result2);
});

function lcm(nums) {
	function gcd(a, b) {
		if (b === 0) {
			return a;
		}
		return gcd(b, a % b);
	}
	const commonGCD = nums.reduce((a, b) => gcd(a, b));
	return nums.reduce((a, b) => (a * b) / commonGCD);
}

function computePath(startNode, sequence, nodes) {
	let moves = 0;
	let idx = 0;
	let currNode = startNode;
	while (!currNode.endsWith('Z')) {
		const { leftNode, rightNode } = nodes.get(currNode);
		if (sequence[idx] === 'L') {
			currNode = leftNode;
		} else if (sequence[idx] === 'R') {
			currNode = rightNode;
		}
		moves++;
		idx = (idx + 1) % sequence.length;
	}
	return moves;
}
