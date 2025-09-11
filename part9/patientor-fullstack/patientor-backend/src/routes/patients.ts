import express, { NextFunction, Request, Response } from "express";
import patientService from "../services/patientService";
import { NewPatientType, PatientType } from "../type";
import newPatientSchema, { newEntrySchema } from "../utils/newPatientSchema";
import z from "zod";

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get("/", (_req, res: Response<PatientType[]>) => {
  res.json(patientService.getAll());
});

router.get("/:id", (req, res: Response<PatientType>, next: NextFunction) => {
  const { id } = req.params;

  try {
    res.json(patientService.getSinglePatient(id));
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatientType>,
    res: Response<PatientType>
  ) => {
    res.json(patientService.addPatient(req.body));
  }
);

router.post("/:id/entries", (req, res, next) => {
  const { id } = req.params;

  try {
    const newEntry = newEntrySchema.parse(req.body);
    res.json(patientService.addPatientEntry(id, newEntry));
  } catch (error) {
    next(error);
  }
});

router.use(errorMiddleware);

export default router;
