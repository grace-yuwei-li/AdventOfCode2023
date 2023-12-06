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
	const seedMap = new Map();
	const seedIDs = lines[0].slice(7).split(' ').map(Number);

	for (let i = 0; i < seedIDs.length; i++) {
		seedMap.set(parseInt(seedIDs[i]), parseInt(seedIDs[i]));
	}

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

	function compareForDestinationArrays(seedMap, index) {
		if (index === destinationArrays.length) {
			return;
		}
		const destArr = destinationArrays[index];
		seedMap.forEach((value, key) => {
			compareRange(seedMap, key, value, destArr);
		});
		compareForDestinationArrays(seedMap, index + 1);
	}

	compareForDestinationArrays(seedMap, 0);

	const result = findMinValue(seedMap);
	console.log('Lowest location number: ', result);
});

function findMinValue(map) {
	let minValue = Infinity;

	for (const value of map.values()) {
		minValue = Math.min(value, minValue);
	}

	return minValue;
}

function parseArrData(line, arr) {
	const entries = line.split(' ').map(Number);
	arr.push(entries);
}

function compareRange(map, key, value, arr) {
	for (let i = 0; i < arr.length; i++) {
		if (value <= arr[i][1] + arr[i][2] - 1 && value >= arr[i][1]) {
			map.set(key, arr[i][0] + value - arr[i][1]);
		}
	}
}

function printMap(map) {
	console.log('size: ', map.size);
	map.forEach((value, key) => {
		console.log('Key: ', key, 'Value: ', value);
	});
}

function printArr(arr) {
	console.log('length: ', arr.length);
	arr.forEach((value, index) => {
		console.log(
			'index',
			index,
			'Destination: ',
			value[0],
			'Source: ',
			value[1],
			'Offset ',
			value[2]
		);
	});
}
