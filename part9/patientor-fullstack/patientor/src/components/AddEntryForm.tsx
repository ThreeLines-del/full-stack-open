import { useEffect, useState } from "react";
import { Diagnosis, NewEntry } from "../types";
import Select from "react-select";
import diagnosis from "../services/diagnosis";

interface AddEntryFormProps {
  onSubmit: (event: React.FormEvent<Element>) => Promise<void>;
  entry: NewEntry;
  setEntry: React.Dispatch<React.SetStateAction<NewEntry>>;
  emptyEntries: Record<
    "HealthCheck" | "Hospital" | "OccupationalHealthcare",
    NewEntry
  >;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddEntryForm = ({
  onSubmit,
  entry,
  setEntry,
  emptyEntries,
  handleOnChange,
}: AddEntryFormProps) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();

  useEffect(() => {
    diagnosis.getAll().then((data) => setDiagnoses(data));
  }, []);

  const options = diagnoses?.map((d) => {
    return {
      value: d.code,
      label: d.code,
    };
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        {(["HealthCheck", "Hospital", "OccupationalHealthcare"] as const).map(
          (type) => (
            <label key={type}>
              <input
                type="radio"
                name="entryType"
                value={type}
                checked={entry.type === type}
                onChange={() => setEntry(emptyEntries[type])}
              />
              {type}
            </label>
          )
        )}
      </div>

      <div>
        date{" "}
        <input
          name="date"
          value={entry.date}
          onChange={handleOnChange}
          type="date"
        />
      </div>
      <div>
        description{" "}
        <input
          name="description"
          value={entry.description}
          onChange={handleOnChange}
          type="text"
        />
      </div>
      <div>
        specialist{" "}
        <input
          name="specialist"
          value={entry.specialist}
          onChange={handleOnChange}
          type="text"
        />
      </div>
      <div>
        diagnosis codes{" "}
        <Select
          options={options}
          onChange={(selected) => {
            setEntry((prev) => ({
              ...prev,
              diagnosisCodes: Array.isArray(selected)
                ? selected.map((option) => option?.value)
                : [],
            }));
          }}
          isMulti={true}
        />
      </div>

      {entry.type === "HealthCheck" && (
        <div>
          health check rating{" "}
          <input
            name="healthCheckRating"
            type="number"
            max={3}
            value={entry.healthCheckRating}
            onChange={handleOnChange}
          />
        </div>
      )}

      {entry.type === "Hospital" && (
        <div>
          discharge date:{" "}
          <input
            type="date"
            name="discharge.date"
            value={entry.discharge?.date ?? ""}
            onChange={handleOnChange}
          />
          criteria:{" "}
          <input
            type="text"
            name="discharge.criteria"
            value={entry.discharge?.criteria ?? ""}
            onChange={handleOnChange}
          />
        </div>
      )}

      {entry.type === "OccupationalHealthcare" && (
        <div>
          employer name{" "}
          <input
            name="employerName"
            type="text"
            value={entry.employerName}
            onChange={handleOnChange}
          />
          sick leave start date:{" "}
          <input
            type="date"
            name="sickLeave.startDate"
            value={entry.sickLeave?.startDate ?? ""}
            onChange={handleOnChange}
          />
          end date:{" "}
          <input
            type="date"
            name="sickLeave.endDate"
            value={entry.sickLeave?.endDate ?? ""}
            onChange={handleOnChange}
          />
        </div>
      )}

      <button type="submit">Add entry</button>
    </form>
  );
};

export default AddEntryForm;
