const parseInput = (input: string) =>
  input.split("\r\n").map((pair) => pair.split(" ") as [string, string]);

const sum = (input: number[]) => input.reduce((total, num) => total + num, 0);

const scoreStrategyOne = (input: [string, string][]) => {
  const opponentChoices = ["A", "B", "C"];
  const youChoices = ["X", "Y", "Z"];

  const outcomeScores = [3, 6, 0];

  const scoreOutcome = ([opponent, you]: [string, string]) => {
    const diff =
      youChoices.indexOf(you) - opponentChoices.indexOf(opponent) + 3;

    return outcomeScores[diff % 3];
  };

  const scoreChoice = ([_, you]: [string, string]) => {
    return youChoices.indexOf(you) + 1;
  };

  const scoreRound = (input: [string, string]) => {
    return scoreOutcome(input) + scoreChoice(input);
  };

  return sum(input.map((round) => scoreRound(round)));
};

const scoreStrategyTwo = (input: [string, string][]) => {
  const opponentChoices = ["A", "B", "C"];
  const outcomes = ["X", "Y", "Z"];

  const outcomeScores = [0, 3, 6];

  const scoreOutcome = ([_, outcome]: [string, string]) => {
    return outcomeScores[outcomes.indexOf(outcome)];
  };

  const scoreChoice = ([opponent, outcome]: [string, string]) => {
    const outcomeModifier = outcomes.indexOf(outcome) - 1;
    const youChoiceIndex =
      (opponentChoices.indexOf(opponent) + outcomeModifier + 3) % 3;
    return youChoiceIndex + 1;
  };

  const scoreRound = (input: [string, string]) => {
    return scoreOutcome(input) + scoreChoice(input);
  };

  return sum(input.map((round) => scoreRound(round)));
};

const strategyGuide = await Deno.readTextFile("./input/day2.txt");

console.log(
  `Total score following first strategy: ${scoreStrategyOne(
    parseInput(strategyGuide)
  )}`
);

console.log(
  `Total score following second strategy: ${scoreStrategyTwo(
    parseInput(strategyGuide)
  )}`
);
