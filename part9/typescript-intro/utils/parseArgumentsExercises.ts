interface Values {
  value1: number[];
  value2: number;
}

const parseArgumentsExercises = (args: string[]): Values => {
  const validValues = args.slice(2);
  if (validValues.length < 2) throw new Error("Not enough arguments");

  if (validValues.every((value) => !isNaN(Number(value)))) {
    return {
      value1: validValues.map((n) => Number(n)).slice(1),
      value2: Number(validValues[0]),
    };
  } else {
    throw new Error("values should be numbers");
  }
};

export default parseArgumentsExercises;
