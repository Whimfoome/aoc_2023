import fs from 'node:fs';

const numbers = {
  one: 'o1e',
  two: 't2o',
  three: 'th3ee',
  four: 'fo4r',
  five: 'fi5e',
  six: 's6x',
  seven: 'sev7n',
  eight: 'eig8t',
  nine: 'ni9e',
};

const data = fs.readFileSync('./day1/input', 'utf-8');
const lines = data.split('\n');

const extractedNumbers = lines.map((value) => {
  let firstNumber = 0;
  let lastNumber = 0;

  const keys = Object.keys(numbers) as (keyof typeof numbers)[];

  for (let i = 3; i < value.length; i++) {
    const partString = value.substring(0, i + 1);
    keys.forEach((keyValue) => {
      if (partString.includes(keyValue)) {
        value = value.replace(keyValue, numbers[keyValue]);
      }
    });
  }

  for (let i = 0; i < value.length; i++) {
    const character = value[i];
    const converted = parseInt(character, 10);

    if (!isNaN(converted)) {
      if (firstNumber === 0) {
        firstNumber = converted;
      }
      lastNumber = converted;
    }
  }

  return firstNumber * 10 + lastNumber;
});

const sum = extractedNumbers.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  0
);

console.log(sum);
