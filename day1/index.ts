const parseInput = (input: string) =>
  input.split("\r\n").map((str) => (str.length ? parseInt(str) : null));

const groupPossessionsByElf = (input: (number | null)[]) =>
  input
    .reduce(
      (grouped, calories) => {
        if (calories === null) {
          return [[], ...grouped];
        }

        const [first, ...rest] = grouped;
        return [[...first, calories], ...rest];
      },
      [[]] as number[][]
    )
    .reverse();

const sum = (input: number[]) => input.reduce((total, num) => total + num, 0);

const sumByGroup = (input: number[][]) => input.map((group) => sum(group));

const takeTopN = (input: number[], n: number) =>
  input.sort((a, b) => b - a).slice(0, n);

const input1 = await Deno.readTextFile("./input/day1.txt");
const topThreeCalories = takeTopN(
  sumByGroup(groupPossessionsByElf(parseInput(input1))),
  3
);

console.log(
  `Elf carrying the most calories is carrying ${topThreeCalories[0]} calories`
);

console.log(
  `The top three elves are carrying ${topThreeCalories.join(
    ", "
  )} calories for a total of ${sum(topThreeCalories)} calories`
);
