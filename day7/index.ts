import sum from "../lib/sum.ts";
const input = await Deno.readTextFile("./input/day7.txt");

type Command<Arg extends string> = `$ ${Arg}`;
// type Cd<Target extends string> = Command<`cd ${Target}`>;
// type Ls = Command<"ls">;
// type Dir<Target extends string> = Command<`dir ${Target}`>;
// type FileString<Size extends string, Name extends string> = `${Size} ${Name}`;

function isCommand(line: string) {
  return line[0] === "$";
}

type Directory = {
  directories: Record<string, Directory>;
  files: Record<string, number>;
  parent?: string;
};

function buildFileSystem(input: string[]) {
  let root: Directory = {
    directories: {
      "/": {
        directories: {},
        files: {},
      },
    },
    files: {},
  };

  let path: string[] = [];
  let contents = [];
  for (const line of input) {
    if (isCommand(line)) {
      if (contents.length) {
        root = pushContents(root, path, contents);
        contents = [];
      }
      path = executeCommand(line, path);
    } else {
      contents.push(line);
    }
  }

  // One final push at end of input
  if (contents.length) {
    root = pushContents(root, path, contents);
    contents = [];
  }

  return root;
}

function pushContents(root: Directory, path: string[], contents: string[]) {
  let dir = root;

  for (const dirName of path) {
    dir = dir.directories[dirName];
  }

  for (const line of contents) {
    const dirName = getDirName(line);
    if (dirName) {
      dir.directories[dirName] = {
        directories: {},
        files: {},
      };
      continue;
    }

    const [size, name] = getFileSizeAndName(line);
    if (name && size) {
      dir.files[name] = size;
    }
  }

  return root;
}

function executeCommand(line: string, path: string[]) {
  const cdTarget = getCdTarget(line);
  if (cdTarget === "..") {
    return path.slice(0, -1);
  } else if (cdTarget) {
    return [...path, cdTarget];
  }

  // Only other command possible is ls
  return path;
}

function getCdTarget(line: string) {
  const match = line.match(/\$ cd (.*)/);
  return match?.[1];
}

function getDirName(line: string) {
  const match = line.match(/dir (.*)/);
  return match?.[1];
}

function getFileSizeAndName(line: string): [number, string] {
  const match = line.match(/([0-9]*) (.*)/);
  if (match) {
    return [Number(match[1]), match[2]];
  }
  return [0, ""];
}

function calculateDirectorySize(dir: Directory) {
  const subDirectorySizes: number[] = Object.values(dir.directories).map(
    calculateDirectorySize
  );
  const fileSizes = Object.values(dir.files);

  return sum([...fileSizes, ...subDirectorySizes]);
}

function mapDirectorySizes(
  dir: Directory,
  map: Record<string, number>,
  path?: string
) {
  for (const [key, directory] of Object.entries(dir.directories)) {
    const subPath = (path || "") + key + "/";
    map = {
      ...map,
      ...mapDirectorySizes(directory, map, subPath),
    };
  }

  if (path) {
    map[path] = calculateDirectorySize(dir);
  }

  return map;
}

const fileSystem = buildFileSystem(input.split("\r\n"));
const directorySizes = mapDirectorySizes(fileSystem, {});
const sumOfSizesBelowThreshold = sum(
  Object.values(directorySizes).filter((size) => size <= 100000)
);

console.log(
  `Total size of directories no larger than 100000: ${sumOfSizesBelowThreshold}`
);

const requiredFreeSpace = 30000000;
const maxSpace = 70000000 - requiredFreeSpace;
const totalSpaceUsed = calculateDirectorySize(fileSystem);
const minimumSpaceToDelete = totalSpaceUsed - maxSpace;
const smallestDirectoryToDelete = Math.min(
  ...Object.values(directorySizes).filter(
    (size) => size >= minimumSpaceToDelete
  )
);

console.log(
  `Size of smallest directory we can delete to leave ${requiredFreeSpace} free space: ${smallestDirectoryToDelete} (greater than ${minimumSpaceToDelete})`
);
