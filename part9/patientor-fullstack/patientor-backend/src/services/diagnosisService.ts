import diagnosis from "../data/diagnosis";
import { DiagnosisType } from "../type";

const getAllDiagnosis = (): DiagnosisType[] => {
  return diagnosis;
};

export default { getAllDiagnosis };
