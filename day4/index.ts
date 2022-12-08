import sum from "../lib/sum.ts";

const input = await Deno.readTextFile("./input/day4.txt");

const pairs = input
  .split("\r\n")
  .map((line) =>
    line
      .split(",")
      .map((assignment) => assignment.split("-").map((str) => Number(str)))
  );

function isFullyOverlapping(first: number[], second: number[]) {
  return first[0] <= second[0] && first[1] >= second[1];
}

function isPartiallyOverlapping(first: number[], second: number[]) {
  return (
    (first[0] >= second[0] && first[0] <= second[1]) ||
    (first[1] >= second[0] && first[1] <= second[1])
  );
}

const fullyOverlappingAssignments = sum(
  pairs
    .map(
      ([first, second]) =>
        isFullyOverlapping(first, second) || isFullyOverlapping(second, first)
    )
    .map(Number)
);

const partiallyOverlappingAssignments = sum(
  pairs
    .map(
      ([first, second]) =>
        isPartiallyOverlapping(first, second) ||
        isPartiallyOverlapping(second, first)
    )
    .map(Number)
);

console.log(
  `Number of fully overlapping assignments: ${fullyOverlappingAssignments}`
);

console.log(
  `Number of partially overlapping assignments: ${partiallyOverlappingAssignments}`
);
