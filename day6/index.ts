const input = await Deno.readTextFile("./input/day6.txt");

// const input = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";

function findMarkerIndex(input: string, markerLength: number) {
  const buffer = [];
  let index = 0;
  for (const char of input) {
    index++;
    buffer.splice(0, buffer.indexOf(char) + 1);
    buffer.push(char);
    if (buffer.length >= markerLength) {
      return index;
    }
  }
}

console.log(
  `First packet marker found after ${findMarkerIndex(input, 4)} characters`
);
console.log(
  `First start-of-message marker found after ${findMarkerIndex(
    input,
    14
  )} characters`
);
