import { HospitalEntryType } from "../types";

interface HospitalProps {
  entry: HospitalEntryType;
  diagnosisDesc: (code: string) => string;
}
const Hospital = ({ entry, diagnosisDesc }: HospitalProps) => {
  return (
    <div style={{ border: "1px solid black", borderRadius: "2px" }}>
      <strong>description: </strong>
      {entry.description} <br />
      <strong>discharge: </strong>
      {entry.discharge?.criteria} <strong>date: </strong>
      {entry.discharge?.date} <br />
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

export default Hospital;
