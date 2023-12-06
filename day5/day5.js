const fs = require('fs');

// Day 5
// Part 1: What is the lowest location number that corresponds to any of the initial seed numbers?
fs.readFile('day5input copy.txt', 'utf-8', (err, data) => {
	if (err) {
		console.err(
			'please help me, it is only day 5 and im struggling so much',
			err
		);
	}

	const lines = data.split('\n');
	const seedMap = new Map();
	const seedIDs = lines[0].slice(8).split(' ');

	for (let i = 0; i < seedIDs.length; i++) {
		seedMap.set(parseInt(seedIDs[i]), -1);
	}

	seedMap.forEach((value, key) => {
		console.log('seed id: ', key, ' destination: ', value);
	});

	const sections = lines.slice(1).join('\n').replace(/\s+/, '').split('\n');

	const seedToSoilMap = new Map();
	const soilToFertilizerMap = new Map();
	const fertilizerToWaterMap = new Map();
	const waterToLightMap = new Map();
	const lightToTempMap = new Map();
	const tempToHumidityMap = new Map();
	const humidityToLocationMap = new Map();

	// const mapSections = {
	// 	seedToSoilMap: seedToSoilMap,
	// 	soilToFertilizerMap: soilToFertilizerMap,
	// 	fertilizerToWaterMap: fertilizerToWaterMap,
	// 	waterToLightMap: waterToLightMap,
	// 	lightToTempMap: lightToTempMap,
	// 	tempToHumidityMap: tempToHumidityMap,
	// 	humidityToLocationMap: humidityToLocationMap,
	// };

	let line = 0;
	while (line < sections.length) {
		if (sections[line].match('seed-to-soil map')) {
			line++;
			while (sections[line] !== '') {
				parseMapData(sections[line], seedToSoilMap);
				line++;
			}
		}
		if (sections[line].match('soil-to-fertilizer map')) {
			line++;
			while (sections[line] !== '') {
				parseMapData(sections[line], soilToFertilizerMap);
				line++;
			}
		}
		if (sections[line].match('fertilizer-to-water map')) {
			line++;
			while (sections[line] !== '') {
				parseMapData(sections[line], fertilizerToWaterMap);
				line++;
			}
		}
		if (sections[line].match('water-to-light map')) {
			line++;
			while (sections[line] !== '') {
				parseMapData(sections[line], waterToLightMap);
				line++;
			}
		}
		if (sections[line].match('light-to-temperature map')) {
			line++;
			while (sections[line] !== '') {
				parseMapData(sections[line], lightToTempMap);
				line++;
			}
		}
		if (sections[line].match('temperature-to-humidity map')) {
			line++;
			while (sections[line] !== '') {
				parseMapData(sections[line], tempToHumidityMap);
				line++;
			}
		}
		if (sections[line].match('humidity-to-location map')) {
			line++;
			while (line < sections.length) {
				parseMapData(sections[line], humidityToLocationMap);
				line++;
			}
		}
		line++;
	}
	console.log(seedToSoilMap);
	console.log(soilToFertilizerMap);
	console.log(fertilizerToWaterMap);
	console.log(waterToLightMap);
	console.log(lightToTempMap);
	console.log(tempToHumidityMap);
	console.log(humidityToLocationMap);
});

function parseMapData(line, map) {
	const entries = line.split(' ').map(Number);
	map.set(entries, -1);
	console.log(line);
}
