import fs from 'fs';

const data = fs.readFileSync('./day3/input', 'utf-8');
const lines = data.split('\n');
if (!lines[lines.length - 1]) {
  lines.pop();
}

const numbersCoordinates = lines.map((line) => {
  let foundNumbers: string[] = [];

  for (let j = 0; j < line.length; j++) {
    const character = line[j];

    if (j === 0) {
      if (isNumber(character)) {
        foundNumbers.push(character);
      } else {
        foundNumbers.push('');
      }
      continue;
    }

    if (isNumber(character)) {
      if (foundNumbers[foundNumbers.length - 1]) {
        foundNumbers[foundNumbers.length - 1] += character;
      } else {
        foundNumbers.push(character);
      }
    } else {
      foundNumbers.push('');
    }
  }

  return foundNumbers;
});

let activeNumberSum = 0;
let totalGearRatio = 0;
const totalGears: Gear[] = [];

for (let i = 0; i < numbersCoordinates.length; i++) {
  const line = numbersCoordinates[i];

  let actualJ = 0;
  for (let j = 0; j < line.length; j++) {
    const element = line[j];
    if (!element) {
      actualJ++;
      continue;
    }

    const [isAdjacent, foundGears] = symbolAdjacent(i, actualJ, element.length);

    foundGears.forEach((gearLoc) => {
      let alreadyExists = false;

      totalGears.forEach((gear) => {
        if (
          gear.location.x === gearLoc.x &&
          gear.location.y === gearLoc.y &&
          !alreadyExists
        ) {
          gear.moving.push(Number(element));
          alreadyExists = true;
        }
      });

      if (!alreadyExists) {
        totalGears.push({
          location: gearLoc,
          moving: [Number(element)],
        });
      }
    });

    if (isAdjacent) {
      activeNumberSum += Number(element);
    }

    actualJ += element.length;
  }
}

for (let gear of totalGears) {
  let gearRatio = 1;
  if (gear.moving.length < 2) {
    continue;
  }

  gear.moving.forEach((ratio) => {
    gearRatio *= ratio;
  });

  totalGearRatio += gearRatio;
}

console.log(activeNumberSum);
console.log(`Gear ratio: ${totalGearRatio}`);

type Gear = {
  location: GearLocation;
  moving: number[];
};

type GearLocation = {
  x: number;
  y: number;
};

function symbolAdjacent(
  indexY: number,
  indexX: number,
  length: number
): [boolean, GearLocation[]] {
  let hasSymbol = false;
  let foundGears: GearLocation[] = [];

  const leftCheck = isSymbol(lines[indexY][indexX - 1]);
  const rightCheck = isSymbol(lines[indexY][indexX + length]);

  if (leftCheck.isSymbol || rightCheck.isSymbol) {
    hasSymbol = true;
  }

  if (leftCheck.isGear) {
    foundGears.push({ x: indexX - 1, y: indexY });
  }
  if (rightCheck.isGear) {
    foundGears.push({ x: indexX + length, y: indexY });
  }

  for (let i = indexX - 1; i <= indexX + length; i++) {
    // Check top
    if (lines[indexY - 1]) {
      const topCheck = isSymbol(lines[indexY - 1][i]);
      if (topCheck.isSymbol) {
        hasSymbol = true;

        if (topCheck.isGear) {
          foundGears.push({ x: i, y: indexY - 1 });
        }
      }
    }

    // Check bottom
    if (lines[indexY + 1]) {
      const bottomCheck = isSymbol(lines[indexY + 1][i]);
      if (bottomCheck.isSymbol) {
        hasSymbol = true;

        if (bottomCheck.isGear) {
          foundGears.push({ x: i, y: indexY + 1 });
        }
      }
    }
  }

  const noDuplicateGears = foundGears.filter(
    (value, index) => foundGears.indexOf(value) === index
  );
  return [hasSymbol, noDuplicateGears];
}

function isSymbol(character: string | undefined) {
  if (!character) {
    return {
      isSymbol: false,
      isGear: false,
    };
  }

  if (character === '*') {
    return {
      isSymbol: true,
      isGear: true,
    };
  }

  if (character.match(/[^\w\d\s.]/)) {
    return {
      isSymbol: true,
      isGear: false,
    };
  }

  return {
    isSymbol: false,
    isGear: false,
  };
}

function isNumber(character: string) {
  if (character.match(/\d/)) {
    return true;
  }
  return false;
}
