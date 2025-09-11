import { Gender, NewPatientType } from "../type";

const toNewPatientType = (object: unknown): NewPatientType => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if ("name" in object && "gender" in object) {
    const newPatient: NewPatientType = {
      name: parseName(object.name),
      gender: parseGender(object.gender),
      entries: [],
    };

    if ("dateOfBirth" in object && object.dateOfBirth !== undefined) {
      newPatient.dateOfBirth = parseDateOfBirth(object.dateOfBirth);
    }

    if ("occupation" in object && object.occupation !== undefined) {
      newPatient.occupation = parseOccupation(object.occupation);
    }

    if ("ssn" in object && object.ssn !== undefined) {
      newPatient.ssn = parseSsn(object.ssn);
    }

    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error(`Incorrect or missing comment ${name}`);
  }
  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error("Incorrect or missing date: " + dateOfBirth);
  }
  return dateOfBirth;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender ${gender}`);
  }

  return gender;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error(`Incorrect or missing comment ${ssn}`);
  }
  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error(`Incorrect or missing comment ${occupation}`);
  }
  return occupation;
};

export default toNewPatientType;
