import { HealthCheckEntryType } from "../types";

interface HealthCheckProps {
  entry: HealthCheckEntryType;
  diagnosisDesc: (code: string) => string;
}

const HealthCheck = ({ entry, diagnosisDesc }: HealthCheckProps) => {
  return (
    <div style={{ border: "1px solid black", borderRadius: "2px" }}>
      <strong>description: </strong>
      {entry.description} <br />
      <strong>health check rating: </strong>
      {entry.healthCheckRating} <br />
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

export default HealthCheck;
