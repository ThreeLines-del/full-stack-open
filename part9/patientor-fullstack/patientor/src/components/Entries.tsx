import { useEffect, useState } from "react";
import { Diagnosis, Entry } from "../types";
import diagnosis from "../services/diagnosis";
import HealthCheck from "./HealthCheck";
import Hospital from "./Hospital";
import OccupationalHealthcare from "./OccupationalHealthcare";

interface EntriesProps {
  entry: Entry;
}

const Entries = ({ entry }: EntriesProps) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();

  useEffect(() => {
    diagnosis.getAll().then((data) => setDiagnoses(data));
  }, []);

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const diagnosisDesc = (code: string): string => {
    const desc = diagnoses?.find((diag) => diag.code === code)?.name;
    return desc || "";
  };

  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheck entry={entry} diagnosisDesc={diagnosisDesc} />;

    case "Hospital":
      return <Hospital entry={entry} diagnosisDesc={diagnosisDesc} />;

    case "OccupationalHealthcare":
      return (
        <OccupationalHealthcare entry={entry} diagnosisDesc={diagnosisDesc} />
      );

    default:
      return assertNever(entry);
  }
};

export default Entries;
