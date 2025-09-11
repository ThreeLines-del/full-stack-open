import z from "zod";
import newPatientSchema, {
  DiagnosisTypeSchema,
  EntrySchema,
  newEntrySchema,
} from "./utils/newPatientSchema";

// export interface DiagnosisType {
//   code: string;
//   name: string;
//   latin?: string;
// }

export type DiagnosisType = z.infer<typeof DiagnosisTypeSchema>;

// interface BaseEntryType {
//   id: string;
//   description: string;
//   date: string;
//   specialist: string;
//   diagnosisCodes?: Array<DiagnosisType["code"]>;
// }

export enum HealthCheckRatingType {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

// interface HealthCheckEntryType extends BaseEntryType {
//   type: "HealthCheck";
//   healthCheckRating: HealthCheckRatingType;
// }

// interface HospitalEntryType extends BaseEntryType {
//   type: "Hospital";
//   discharge?: {
//     date: string;
//     criteria: string;
//   };
// }

// interface OccupationalHealthcareEntryType extends BaseEntryType {
//   type: "OccupationalHealthcare";
//   employerName: string;
//   sickLeave?: {
//     startDate: string;
//     endDate: string;
//   };
// }

// export type Entry =
//   | HealthCheckEntryType
//   | HospitalEntryType
//   | OccupationalHealthcareEntryType;

export type Entry = z.infer<typeof EntrySchema>;
export type NewEntryType = z.infer<typeof newEntrySchema>;

export interface PatientType {
  id: string;
  name: string;
  dateOfBirth?: string;
  ssn?: string;
  gender: Gender;
  occupation?: string;
  entries: Entry[];
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export type NewPatientType = z.infer<typeof newPatientSchema>;

export type NonSensitivePatient = Omit<PatientType, "ssn" | "entries">;
