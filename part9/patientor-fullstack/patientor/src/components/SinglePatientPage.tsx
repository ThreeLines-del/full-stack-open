import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patients from "../services/patients";
import { NewEntry, Patient } from "../types";
import Entries from "./Entries";
import axios from "axios";
import AddEntryForm from "./AddEntryForm";

const emptyEntries: Record<NewEntry["type"], NewEntry> = {
  HealthCheck: {
    type: "HealthCheck",
    date: "",
    description: "",
    healthCheckRating: 0,
    specialist: "",
    diagnosisCodes: [],
  },
  Hospital: {
    type: "Hospital",
    date: "",
    description: "",
    specialist: "",
    diagnosisCodes: [],
    discharge: {
      criteria: "",
      date: "",
    },
  },
  OccupationalHealthcare: {
    type: "OccupationalHealthcare",
    date: "",
    description: "",
    specialist: "",
    diagnosisCodes: [],
    employerName: "",
    sickLeave: {
      startDate: "",
      endDate: "",
    },
  },
};

const SinglePatientPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient>();
  const [entry, setEntry] = useState<NewEntry>(emptyEntries["HealthCheck"]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setEntry(emptyEntries[entry.type]);
  }, [entry.type]);

  function setNestedField<T>(obj: T, path: string, value: unknown): T {
    const keys = path.split(".");
    const lastKey = keys.pop()!;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temp: any = { ...obj };
    let curr = temp;

    for (const key of keys) {
      curr[key] = { ...curr[key] };
      curr = curr[key];
    }

    curr[lastKey] = value;
    return temp;
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setEntry((prev) => setNestedField(prev, name, value));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const newEntry = await patients.addEntry(id, entry);
      console.log(newEntry);
      setPatient((prev) =>
        prev ? { ...prev, entries: [...(prev.entries ?? []), newEntry] } : prev
      );
      setEntry(emptyEntries[entry.type]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error[0]?.message);
        setTimeout(() => {
          setError("");
        }, 5000);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    patients.getSingle(id!).then((data) => setPatient(data));
  }, [id]);

  return (
    <div>
      <h2>{patient?.name}</h2>
      <strong>gender: </strong>
      {patient?.gender} <br />
      <strong>ssn: </strong>
      {patient?.ssn}
      <br />
      <strong>occupation: </strong>
      {patient?.occupation}
      <div>
        <h3>Add Entry</h3>
        {error ? <h4 style={{ color: "red" }}>{error}</h4> : null}
        <AddEntryForm
          emptyEntries={emptyEntries}
          entry={entry}
          handleOnChange={handleOnChange}
          onSubmit={onSubmit}
          setEntry={setEntry}
        />
      </div>
      <h3>Entries</h3>
      {patient?.entries?.map((entry) => (
        <div key={entry.id}>
          <Entries entry={entry} /> <br />
        </div>
      ))}
    </div>
  );
};

export default SinglePatientPage;
