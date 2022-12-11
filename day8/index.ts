import sum from "../lib/sum.ts";

const input = await Deno.readTextFile("./input/day8.txt");

const rows = input.split("\r\n").map((str) => str.split("").map(Number));
const columns = rows.reduce((cols, row) => {
  row.forEach((entry, i) => (cols[i] = [...cols[i], entry]));
  return cols;
}, new Array(rows[0].length).fill([]));

function isVisible(value: number, index: number, trees: number[]) {
  if (index === 0 || index === trees.length - 1) {
    return true;
  }

  if (trees.slice(0, index).every((tree) => tree < value)) {
    return true;
  }

  if (trees.slice(index + 1).every((tree) => tree < value)) {
    return true;
  }

  return false;
}

function mapVisibility(rows: number[][], columns: number[][]) {
  return rows.map((row, i) =>
    row.map((tree, j) => {
      if (isVisible(tree, j, row) || isVisible(tree, i, columns[j])) {
        return 1;
      }
      return 0;
    })
  );
}

function twoDScenicScore(value: number, index: number, trees: number[]) {
  const before =
    trees
      .slice(0, index)
      .reverse()
      .findIndex((tree) => tree >= value) + 1 || index;

  const after =
    trees.slice(index + 1).findIndex((tree) => tree >= value) + 1 ||
    trees.length - (index + 1);

  return before * after;
}

function calculateScenicScores(rows: number[][], columns: number[][]) {
  return rows.map((row, i) =>
    row.map((tree, j) => {
      return (
        twoDScenicScore(tree, j, row) * twoDScenicScore(tree, i, columns[j])
      );
    })
  );
}

const visibleTreesMap = mapVisibility(rows, columns);
const totalVisible = sum(visibleTreesMap.flat());

console.log("Total visible trees: ", totalVisible);

const scenicScores = calculateScenicScores(rows, columns);
const maximumScenicScore = Math.max(...scenicScores.flat());

console.log("Highest scenic score: ", maximumScenicScore);
