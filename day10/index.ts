import sum from "../lib/sum.ts";
import chunkArray from "../lib/chunkArray.ts";

const input = await Deno.readTextFile("./input/day10.txt");

function calculateRegisterLog(input: string) {
  const operations = input.matchAll(/(?:addx|noop) ?(-*[0-9]+)?/g);

  const registerLog: number[] = [1];

  for (const [_match, operationString] of operations) {
    const operation = Number(operationString);
    const register = registerLog.at(-1)!;
    if (isNaN(operation)) {
      registerLog.push(register);
    } else {
      registerLog.push(register, register + operation);
    }
  }

  return registerLog;
}

function sumSignalStrengths(
  registerLog: number[],
  cycles: number,
  startCycle: number,
  endCycle: number
) {
  return sum(
    registerLog
      .map((register, cycle) => register * (cycle + 1))
      .slice(startCycle - 1, endCycle)
      .filter((_, cycle) => cycle % cycles === 0)
  );
}

function choosePixel(register: number, pixelIndex: number) {
  if (Math.abs(register - pixelIndex) <= 1) {
    return "#";
  }

  return ".";
}

function printScreen(
  registerLog: number[],
  lines: number,
  pixelsPerLine: number
) {
  return chunkArray(registerLog, pixelsPerLine)
    .slice(0, lines)
    .map((line) => line.map(choosePixel).join(""))
    .join("\n");
}

const registerLog = calculateRegisterLog(input);

console.log(
  `Sum of every 40th signal strength: `,
  sumSignalStrengths(registerLog, 40, 20, 220)
);

console.log(`Screen output:
${printScreen(registerLog, 6, 40)}
`);
