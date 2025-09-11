export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

interface BaseEntryType {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

export enum HealthCheckRatingType {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export interface HealthCheckEntryType extends BaseEntryType {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRatingType;
}

export interface HospitalEntryType extends BaseEntryType {
  type: "Hospital";
  discharge?: {
    date: string;
    criteria: string;
  };
}

export interface OccupationalHealthcareEntryType extends BaseEntryType {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export type Entry =
  | HealthCheckEntryType
  | HospitalEntryType
  | OccupationalHealthcareEntryType;

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;
export type NewEntry = UnionOmit<Entry, "id">;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth?: string;
  ssn?: string;
  gender: Gender;
  occupation?: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;
