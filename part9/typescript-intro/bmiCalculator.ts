interface Values {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): Values => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const meters = height * 0.01;
  const result = weight / (meters * meters);

  if (result < 16) {
    return "Underweight (Severe thinness)";
  } else if (result <= 17) {
    return "Underweight (Moderate thinness)";
  } else if (result <= 18.5) {
    return "Underweight (Mild thinness)";
  } else if (result <= 25) {
    return "Normal range";
  } else if (result <= 30) {
    return "Overweight (Pre-obese)";
  } else if (result <= 35) {
    return "Obese (Class I)";
  } else if (result < 40) {
    return "Obese (Class II)";
  } else if (result > 40) {
    return "Obese (Class III)";
  }
  return "Unable to calculate BMI";
};

if (require.main === module) {
  const { value1, value2 } = parseArguments(process.argv);
  console.log(calculateBmi(value1, value2));
}
