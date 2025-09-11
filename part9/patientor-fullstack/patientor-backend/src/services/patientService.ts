import patients from "../data/patients";
import {
  NewPatientType,
  PatientType,
  NonSensitivePatient,
  NewEntryType,
  Entry,
} from "../type";
import { v1 as uuid } from "uuid";

const getAll = (): PatientType[] => {
  return patients;
};

const getAllPatients = (): NonSensitivePatient[] => {
  return patients.map((patient) => ({
    name: patient.name,
    gender: patient.gender,
    dateOfBirth: patient.dateOfBirth,
    id: patient.id,
    occupation: patient.occupation,
  }));
};

const getSinglePatient = (id: string): PatientType => {
  const patient = patients.find((patient) => patient.id === id);
  if (!patient) {
    throw Error("patient not found");
  }
  return patient;
};

const addPatient = (newPatientObj: NewPatientType): PatientType => {
  const id = uuid();
  const newPatient: PatientType = {
    ...newPatientObj,
    id: id,
  };

  patients.concat(newPatient);
  return newPatient;
};

const addPatientEntry = (
  patientId: string,
  newPatientEntryObj: NewEntryType
): Entry => {
  const id = uuid();
  const newPatientEntry = {
    ...newPatientEntryObj,
    id: id,
  };

  patients.map((patient) =>
    patient.id === patientId ? [...patient.entries, newPatientEntry] : patient
  );

  return newPatientEntry;
};

export default {
  getAllPatients,
  addPatient,
  getAll,
  getSinglePatient,
  addPatientEntry,
};
