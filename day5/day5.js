const fs = require('fs');

// Day 5
// Part 1: What is the lowest location number that corresponds to any of the initial seed numbers?
fs.readFile('day5input.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err(
			'please help me, it is only day 5 and im struggling so much',
			err
		);
	}

	const lines = data.split('\n');
	const seedIDs = lines[0].slice(7).split(' ').map(Number);
	const seedIDs2 = lines[0].slice(7).split(' ').map(Number);

	const sections = lines.slice(1).join('\n').replace(/\s+/, '').split('\n');

	const seedToSoilArr = [];
	const soilToFertilizerArr = [];
	const fertilizerToWaterArr = [];
	const waterToLightArr = [];
	const lightToTempArr = [];
	const tempToHumidityArr = [];
	const humidityToLocationArr = [];
	const arrSections = {
		'seed-to-soil map:': seedToSoilArr,
		'soil-to-fertilizer map:': soilToFertilizerArr,
		'fertilizer-to-water map:': fertilizerToWaterArr,
		'water-to-light map:': waterToLightArr,
		'light-to-temperature map:': lightToTempArr,
		'temperature-to-humidity map:': tempToHumidityArr,
	};

	let line = 0;
	while (line < sections.length) {
		const currentSection = sections[line];
		const arr = arrSections[currentSection];
		if (currentSection.match('humidity-to-location map')) {
			line++;
			while (line < sections.length) {
				parseArrData(sections[line], humidityToLocationArr);
				line++;
			}
		} else if (arr) {
			line++;
			while (sections[line] !== '') {
				parseArrData(sections[line], arr);
				line++;
			}
		}
		line++;
	}

	const destinationArrays = [
		seedToSoilArr,
		soilToFertilizerArr,
		fertilizerToWaterArr,
		waterToLightArr,
		lightToTempArr,
		tempToHumidityArr,
		humidityToLocationArr,
	];

	// Part 1:
	let minValue = Infinity;
	for (let i = 0; i < seedIDs.length; i++) {
		mapToLocation(parseInt(seedIDs[i]), 0);
	}

	// Part 2:
	let minValue2 = Infinity;
	for (let i = 0; i < seedIDs2.length; i += 2) {
		let idx = 0;
		mapToLocation(parseInt(seedIDs2[i]), 0);
		console.log('processed one seed', i);
		while (idx < seedIDs2[i + 1]) {
			mapToLocation(parseInt(seedIDs2[i]) + idx, 0);
			idx++;
		}
	}

	function mapToLocation(seed, index) {
		if (index === destinationArrays.length) {
			return;
		}
		const destArr = destinationArrays[index];
		const newSeedValue = applyRanges(seed, destArr);
		if (index === destinationArrays.length - 1) {
			minValue2 = Math.min(newSeedValue, minValue2);
		}
		mapToLocation(newSeedValue, index + 1);
	}

	console.log('Lowest location number: ', minValue);
	console.log('Lowest location number for part 2: ', minValue2);
});

function parseArrData(line, arr) {
	const entries = line.split(' ').map(Number);
	arr.push(entries);
}

function applyRanges(value, arr) {
	let newValue = value;
	for (let i = 0; i < arr.length; i++) {
		if (value <= arr[i][1] + arr[i][2] - 1 && value >= arr[i][1]) {
			newValue = arr[i][0] + value - arr[i][1];
		}
	}
	return newValue;
}
