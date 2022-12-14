const input = await Deno.readTextFile("./input/day12.txt");

const characters = "abcdefghijklmnopqrstuvwxyz";

type elevationFilterFunc = (elevation: number) => (node: number[]) => boolean;

const forwardFilterFunc =
  (elevation: number) =>
  ([r, c]: number[]) =>
    elevationMap[r][c] - elevation <= 1;

const backwardsFilterFunc =
  (elevation: number) =>
  ([r, c]: number[]) =>
    elevationMap[r][c] - elevation >= -1;

function getReachableNodes(
  node: number[],
  elevationMap: number[][],
  filterFunc: elevationFilterFunc
) {
  const [r, c] = node;
  const elevation = elevationMap[r][c];
  const neighbours = [
    r - 1 >= 0 && [r - 1, c],
    r + 1 < elevationMap.length && [r + 1, c],
    c - 1 >= 0 && [r, c - 1],
    c + 1 < elevationMap[0].length && [r, c + 1],
  ].filter(Boolean) as number[][];

  return neighbours.filter(filterFunc(elevation));
}

const elevationMap = input.split("\r\n").map((line) =>
  line.split("").map((char) => {
    if (char === "S") {
      return 0;
    } else if (char === "E") {
      return 25;
    }

    return characters.indexOf(char);
  })
);

const startIndex = input
  .split("\r\n")
  .map((line, i) => [i, line.indexOf("S")])
  .find(([_, col]) => col !== -1)!;
const endIndex = input
  .split("\r\n")
  .map((line, i) => [i, line.indexOf("E")])
  .find(([_, col]) => col !== -1)!;

function getStepsStartToEnd() {
  const visitedNodes = new Set(JSON.stringify(startIndex));
  let paths = [[startIndex]];

  while (!visitedNodes.has(JSON.stringify(endIndex))) {
    paths = paths
      .map((path) => {
        const current = path.at(-1)!;
        const reachableNodes = getReachableNodes(
          current,
          elevationMap,
          forwardFilterFunc
        );

        const unvisitedNodes = reachableNodes.filter(
          (node) => !visitedNodes.has(JSON.stringify(node))
        );

        unvisitedNodes.forEach((node) =>
          visitedNodes.add(JSON.stringify(node))
        );

        const newPaths = unvisitedNodes.map((node) => [...path, node]);
        return newPaths;
      })
      .flat();
  }

  return paths[0].length - 1;
}

function getStepEndToZeroElevation() {
  const visitedNodes = new Set(JSON.stringify(endIndex));
  let paths = [[endIndex]];

  function minimumCurrentElevation() {
    return Math.min(
      ...paths.map((path) => {
        const [r, c] = path.at(-1)!;
        return elevationMap[r][c];
      })
    );
  }

  while (minimumCurrentElevation() > 0) {
    paths = paths
      .map((path) => {
        const current = path.at(-1)!;

        const reachableNodes = getReachableNodes(
          current,
          elevationMap,
          backwardsFilterFunc
        );

        const unvisitedNodes = reachableNodes.filter(
          (node) => !visitedNodes.has(JSON.stringify(node))
        );

        unvisitedNodes.forEach((node) =>
          visitedNodes.add(JSON.stringify(node))
        );

        const newPaths = unvisitedNodes.map((node) => [...path, node]);
        return newPaths;
      })
      .flat();
  }

  return paths[0].length - 1;
}

console.log(`Steps to reach the end: ${getStepsStartToEnd()}`);

console.log(
  `Steps to reach the elevation 0 from the end: ${getStepEndToZeroElevation()}`
);
