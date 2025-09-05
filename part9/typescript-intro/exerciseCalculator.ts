import parseArgumentsExercises from "./utils/parseArgumentsExercises";

interface RatingType {
  ratingFigure: number;
  ratingDescription: string;
}

interface CalculateExerciseType {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercise = (
  dailyHours: number[],
  target: number
): CalculateExerciseType => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((day) => day !== 0).length;
  const averageHours =
    dailyHours.reduce((acc, hour) => acc + hour, 0) / periodLength;

  const success = averageHours >= target;
  const rating = ratingFxn(averageHours, target);
  return {
    periodLength: periodLength,
    trainingDays: trainingDays,
    success: success,
    rating: rating.ratingFigure,
    ratingDescription: rating.ratingDescription,
    target: target,
    average: averageHours,
  };
};

const ratingFxn = (averageHours: number, target: number): RatingType => {
  let ratingFigure = 0;
  let ratingDescription = "";

  if (averageHours < target * 0.5) {
    ratingFigure = 1;
    ratingDescription = "not good enough";
  } else if (averageHours < target) {
    ratingFigure = 2;
    ratingDescription = "not too bad but could be better";
  } else if (averageHours >= target) {
    ratingFigure = 3;
    ratingDescription = "well done";
  }

  return {
    ratingFigure,
    ratingDescription,
  };
};

if (require.main === module) {
  const { value1, value2 } = parseArgumentsExercises(process.argv);
  console.log(calculateExercise(value1, value2));
}
