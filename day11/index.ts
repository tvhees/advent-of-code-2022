const input = await Deno.readTextFile("./input/day11.txt");

function reduceWorry(item: number) {
  return Math.floor(item / 3.0);
}

function modulusWorry(modulus: number) {
  return (item: number) => item % modulus;
}

function getInspectFunction([operator, operand]: string[]) {
  if (operand === "old") {
    return operator === "*"
      ? (old: number) => old * old
      : (old: number) => old + old;
  }

  const operandNumber = Number(operand);

  return operator === "*"
    ? (old: number) => old * operandNumber
    : (old: number) => old + operandNumber;
}

function parseMonkeyInput(input: string[]) {
  const items = input[1].split(": ").pop()?.split(", ").map(Number)!;
  const operationParams = input[2].split("old ").pop()?.split(" ")!;
  const inspectItem = getInspectFunction(operationParams);

  const divisor = Number(input[3].split("by ").pop());
  const trueMonkey = Number(input[4].split("monkey ").pop());
  const falseMonkey = Number(input[5].split("monkey ").pop());
  const testItem = (item: number) =>
    item % divisor === 0 ? trueMonkey : falseMonkey;

  return {
    items,
    divisor,
    inspectItem,
    testItem,
    inspections: 0,
  };
}

function conductRound(
  monkeys: ReturnType<typeof parseMonkeyInput>[],
  worryAlgorithm: (item: number) => number
) {
  for (let i = 0; i < monkeys.length; i++) {
    const monkey = monkeys[i];
    for (let j = 0; j < monkey.items.length; j++) {
      const item = worryAlgorithm(monkey.inspectItem(monkey.items[j]));
      const newMonkey = monkey.testItem(item);
      monkeys[newMonkey].items.push(item);
      monkey.inspections++;
    }

    monkey.items = [];
  }

  return monkeys;
}

function watchMonkeys(
  input: string,
  worryAlgorithm: (item: number) => number,
  rounds: number
) {
  let monkeys = input
    .split("\r\n\r\n")
    .map((str) => str.split("\r\n"))
    .map(parseMonkeyInput);

  for (let i = 0; i < rounds; i++) {
    monkeys = conductRound(monkeys, worryAlgorithm);
  }

  return monkeys;
}

const monkeyActivity = watchMonkeys(input, reduceWorry, 20)
  .map((monkey) => monkey.inspections)
  .toSorted((b, a) => a - b);

console.log(
  `Monkey business over 20 rounds, reducing worry after inspection: ${
    monkeyActivity[0] * monkeyActivity[1]
  }`
);

const superModulus = input
  .split("\r\n\r\n")
  .map((str) => str.split("\r\n"))
  .map(parseMonkeyInput)
  .map((monkey) => monkey.divisor)
  .reduce((mod, divisor) => mod * divisor, 1);

const worriedMonkeyActivity = watchMonkeys(
  input,
  modulusWorry(superModulus),
  10000
)
  .map((monkey) => monkey.inspections)
  .toSorted((b, a) => a - b);

console.log(
  `Monkey business over 10000 rounds, not reducing worry after inspection: ${
    worriedMonkeyActivity[0] * worriedMonkeyActivity[1]
  }`
);
