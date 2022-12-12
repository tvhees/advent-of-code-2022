const input = await Deno.readTextFile("./input/day9.txt");

const moveMap = {
  U: [0, 1],
  R: [1, 0],
  L: [-1, 0],
  D: [0, -1],
};

function getTailHistory(input: string, knots: number) {
  const headMoves = input.matchAll(/(.) ([0-9]*)/g) as IterableIterator<
    [string, keyof typeof moveMap, number]
  >;

  const rope = Array(knots).fill([0, 0]);

  const tailHistory = new Set<string>();

  function applyMove(position: number[], move: number[]) {
    return [position[0] + move[0], position[1] + move[1]];
  }

  function getKnotMove(head: number[], tail: number[]) {
    const xDifference = head[0] - tail[0];
    const yDifference = head[1] - tail[1];

    if (Math.abs(xDifference) < 2 && Math.abs(yDifference) < 2) {
      return [0, 0];
    }

    return [Math.sign(xDifference), Math.sign(yDifference)];
  }

  for (const [_match, dir, count] of headMoves) {
    const move = moveMap[dir];

    for (let i = 0; i < count; i++) {
      rope[0] = applyMove(rope[0], move);

      for (let i = 1; i < rope.length; i++) {
        rope[i] = applyMove(rope[i], getKnotMove(rope[i - 1], rope[i]));
      }
      tailHistory.add(JSON.stringify(rope.at(-1)));
    }
  }

  return tailHistory.size;
}

console.log(
  `Positions visited by tail for 2 knot rope: ${getTailHistory(input, 2)}`
);

console.log(
  `Positions visited by tail for 10 knot rope: ${getTailHistory(input, 10)}`
);
