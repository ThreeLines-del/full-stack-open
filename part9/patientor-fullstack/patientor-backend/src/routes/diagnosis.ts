import express, { Response } from "express";
import diagnosisService from "../services/diagnosisService";
import { DiagnosisType } from "../type";

const router = express.Router();

router.get("/", (_req, res: Response<DiagnosisType[]>) => {
  const result = diagnosisService.getAllDiagnosis();
  res.json(result);
});

export default router;
