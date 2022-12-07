import sum from "../lib/sum.ts";

const input = await Deno.readTextFile("./input/day3.txt");

const rucksacks = input.split("\r\n");

const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function scoreItem(char: string) {
  return characters.indexOf(char) + 1;
}

function halveString(str: string) {
  return [str.slice(0, str.length / 2), str.slice(str.length / 2)];
}

function chunkArray<T>(arr: T[], size: number) {
  return arr.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!chunks[chunkIndex]) {
      chunks.push([]);
    }

    chunks[chunkIndex].push(item);

    return chunks;
  }, [] as T[][]);
}

function sumRepeatedItems(groups: string[][]) {
  function findRepeatedItem([first, ...rest]: string[]) {
    for (const char of first) {
      if (rest.every((group) => group.includes(char))) {
        return char;
      }
    }

    return " ";
  }

  return sum(groups.map(findRepeatedItem).map(scoreItem));
}

const part1 = sumRepeatedItems(rucksacks.map(halveString));

const part2 = sumRepeatedItems(chunkArray(rucksacks, 3));

console.log(`Sum of packing errors: ${part1}`);
console.log(`Sum of badges: ${part2}`);
