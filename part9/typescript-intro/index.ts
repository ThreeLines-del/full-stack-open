import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercise } from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  if (!height || !weight) {
    res.status(400).json({
      error: "malformatted parameters",
    });
  }

  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const bmi = calculateBmi(Number(height), Number(weight));
  res.json({
    weight: weight,
    height: height,
    bmi: bmi,
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  console.log(daily_exercises, target);

  if (!daily_exercises || !target) {
    res.status(400).json({
      error: "parameters missing",
    });
  }

  if (
    (daily_exercises as unknown[]).every((value) => isNaN(Number(value))) ||
    isNaN(Number(target))
  ) {
    res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const result = calculateExercise(
    daily_exercises as number[],
    target as number
  );
  res.json(result);
});

app.listen(2000, () => {
  console.log("server running on port 2000");
});
