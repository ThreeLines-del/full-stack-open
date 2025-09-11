import z from "zod";
import { Gender, HealthCheckRatingType } from "../type";

export const DiagnosisTypeSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional(),
});

const DiagnosisCodesSchema = z.array(DiagnosisTypeSchema.shape.code).optional();

const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string().nonempty("description is required"),
  date: z.string().nonempty("date is required"),
  specialist: z.string().nonempty("specialist is required"),
  diagnosisCodes: DiagnosisCodesSchema,
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z
    .object({
      date: z.string(),
      criteria: z.string(),
    })
    .optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.enum(HealthCheckRatingType),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

export const EntrySchema = z.discriminatedUnion("type", [
  HospitalEntrySchema,
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

export const newEntrySchema = z.discriminatedUnion("type", [
  HospitalEntrySchema.omit({ id: true }),
  HealthCheckEntrySchema.omit({ id: true }),
  OccupationalHealthcareEntrySchema.omit({ id: true }),
]);

const newPatientSchema = z.object({
  name: z.string(),
  gender: z.enum(Gender),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      error: "Must be a valid date string",
    })
    .optional(),
  occupation: z.string().optional(),
  ssn: z.string().optional(),
  entries: z.array(EntrySchema),
});

export default newPatientSchema;
