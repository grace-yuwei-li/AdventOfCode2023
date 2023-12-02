const fs = require('fs');

// Day 1: What is the sum of all of the calibration values?
// Part 1:
fs.readFile('day1input.txt', 'utf-8', (err, data) => {

    if (err) {
        console.err('ERROR! ABORT! PANIC! FILE IS NOT READABLE! DDDDDDD:', err);
        return;
    }

    const lines = data.split('\n');

    const result = lines.map(line => {
        line = line.trim();
        const digits = line.replace(/\D/g, '');
        const firstDigit = parseInt(digits[0]);
        const lastDigit = parseInt(digits.slice(-1));

        const twoDigitNumber = firstDigit * 10 + lastDigit;
        return twoDigitNumber;
    });

    let answer = 0;
    result.forEach((twoDigitNumber) => {
        if (/^\d+$/.test(twoDigitNumber)) {
            answer += parseInt(twoDigitNumber, 10);
        }
    });

    console.log('Sum:', answer);
});

// Part 2
fs.readFile('day1input.txt', 'utf-8', (err, data) => {

    if (err) {
        console.error('ERROR! ABORT! PANIC! FILE IS NOT READABLE! DDDDDDD:', err);
        return;
    }

    const wordToDigitMap = {
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9
    }

    const reversedToDigitMap = {
        'eno': 1,
        'owt': 2,
        'eerht': 3,
        'ruof': 4,
        'evif': 5,
        'xis': 6,
        'neves': 7,
        'thgie': 8,
        'enin': 9,
    }

    const lines = data.split('\n');
    const result = lines.map(line => {
        const regex = /(one|two|three|four|five|six|seven|eight|nine|[1-9])/;
        const replacedLine = line.replace(regex, match => {
            return wordToDigitMap[match] || match;
        });
        const reversedString = replacedLine.split('').reverse().join('');

        const reverseRegex = /(eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|[1-9])/;
        const reverseReplacedLine = reversedString.replace(reverseRegex, match => {
            return reversedToDigitMap[match] || match;
        });
        const reReversedString = reverseReplacedLine.split('').reverse().join('');

        const digits = reReversedString.replace(/\D/g, '');
        const firstDigit = parseInt(digits[0]);
        const lastDigit = parseInt(digits.slice(-1));

        const twoDigitNumber = firstDigit * 10 + lastDigit;
        return twoDigitNumber;
    });

    let answer = 0;
    result.forEach((twoDigitNumber) => {
        if (/^\d+$/.test(twoDigitNumber)) {
            answer += parseInt(twoDigitNumber, 10);
       }
    });

    console.log('Sum:', answer);
});