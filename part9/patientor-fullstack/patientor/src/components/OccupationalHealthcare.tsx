import { OccupationalHealthcareEntryType } from "../types";

interface OccupationalHealthcareProps {
  entry: OccupationalHealthcareEntryType;
  diagnosisDesc: (code: string) => string;
}

const OccupationalHealthcare = ({
  entry,
  diagnosisDesc,
}: OccupationalHealthcareProps) => {
  return (
    <div style={{ border: "1px solid black", borderRadius: "2px" }}>
      <strong>description: </strong>
      {entry.description} <br />
      <strong>employer name: </strong>
      {entry.employerName} <br />
      <strong>sick leave: </strong> start: {entry.sickLeave?.startDate} end:{" "}
      {entry.sickLeave?.endDate} <br />
      {entry.diagnosisCodes && (
        <>
          <strong>diagnosis codes: </strong>
          <ul>
            {entry.diagnosisCodes?.map((c, i) => (
              <li key={i}>
                {c} {diagnosisDesc(c)}
              </li>
            ))}
          </ul>
          <br />
        </>
      )}
      <strong>specialist: </strong>
      {entry.specialist}
    </div>
  );
};

export default OccupationalHealthcare;
