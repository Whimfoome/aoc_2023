import fs from 'fs';

const data = fs.readFileSync('./day2/input', 'utf-8');
const lines = data.split('\n');
if (!lines[lines.length - 1]) {
  lines.pop();
}

const games = lines.map((value) => {
  const extracted = value.slice(5);
  const [gameId, allSets] = extracted.split(': ');
  const sets = allSets.split('; ');

  const totalCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  let isPossible = true;

  const minCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  sets.forEach((valueSet) => {
    const cubeCount = getCubes(valueSet);
    totalCubes.red += cubeCount.red;
    totalCubes.green += cubeCount.green;
    totalCubes.blue += cubeCount.blue;

    if (cubeCount.red > 12 || cubeCount.green > 13 || cubeCount.blue > 14) {
      isPossible = false;
    }

    if (cubeCount.red > minCubes.red) {
      minCubes.red = cubeCount.red;
    }
    if (cubeCount.green > minCubes.green) {
      minCubes.green = cubeCount.green;
    }
    if (cubeCount.blue > minCubes.blue) {
      minCubes.blue = cubeCount.blue;
    }
  });

  return {
    id: Number(gameId),
    possible: isPossible,
    power: minCubes.red * minCubes.green * minCubes.blue,
  };
});

const sum = games.reduce((accumulator, currentValue) => {
  if (currentValue.possible) {
    return accumulator + currentValue.id;
  }
  return accumulator;
}, 0);

const sumPower = games.reduce(
  (accumulator, currentValue) => accumulator + currentValue.power,
  0
);

console.log('Part 1: ' + sum);
console.log('Part 2: ' + sumPower);

function getCubes(stringSet: string) {
  let cubes = {
    red: 0,
    green: 0,
    blue: 0,
  };
  const separateColors = stringSet.split(', ');

  separateColors.forEach((separatedColor) => {
    const [amount, color] = separatedColor.split(' ');

    const colorKey = color as keyof typeof cubes;
    let amountValue = parseInt(amount, 10);
    if (isNaN(amountValue)) {
      amountValue = 0;
    }

    cubes[colorKey] += amountValue;
  });

  return cubes;
}
