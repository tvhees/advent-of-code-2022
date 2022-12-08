import chunkArray from "../lib/chunkArray.ts";

const input = await Deno.readTextFile("./input/day5.txt");

type StackerAlgorithm = (
  columns: string[][],
  count: number,
  from: number,
  to: number
) => string[][];

function rearrangeCrates(input: string, executeMove: StackerAlgorithm) {
  const [initialStateString, movesString] = input.split("\r\n\r\n");

  const rows = initialStateString
    .split("\r\n")
    .map((row) =>
      chunkArray(row.split(""), 4).map((item) =>
        item.filter((char) => !["[", "]", " "].includes(char))
      )
    )
    .reverse()
    .slice(1);

  const parseMoveRegex = /move (\d+) from (\d+) to (\d+)/g;

  const match = movesString.matchAll(parseMoveRegex);

  let columns = rows.reduce((cols, row) => {
    row.forEach((item, index) => {
      cols[index] = cols[index].concat(item);
    });
    return cols;
  }, new Array(rows[0].length).fill([]));

  for (const [_match, count, from, to] of match) {
    columns = executeMove(
      columns,
      Number(count),
      Number(from) - 1,
      Number(to) - 1
    );
  }

  const topCratesAfterRearrangement = columns.map((col) => col.at(-1)).join("");

  return topCratesAfterRearrangement;
}

function stacker9000(
  columns: string[][],
  count: number,
  from: number,
  to: number
) {
  for (let i = 0; i < count; i++) {
    const crate = columns[from].pop();
    columns[to].push(crate!);
  }

  return columns;
}

function stacker9001(
  columns: string[][],
  count: number,
  from: number,
  to: number
) {
  const crates = columns[from].splice(-count);
  columns[to].push(...crates);

  return columns;
}

const cratesAfterStacker9000 = rearrangeCrates(input, stacker9000);
const cratesAfterStacker9001 = rearrangeCrates(input, stacker9001);

console.log(
  `Crates on top after rearrangement with Stacker9000: ${cratesAfterStacker9000}`
);

console.log(
  `Crates on top after rearrangement with Stacker9001: ${cratesAfterStacker9001}`
);
