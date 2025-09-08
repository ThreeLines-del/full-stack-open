import React from "react";
import type { CoursePart } from "../App";

interface PartProps {
  part: CoursePart;
}

const Part: React.FC<PartProps> = ({ part }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (part.kind) {
    case "basic":
      return (
        <div>
          <h3>
            {part.name} ({part.exerciseCount} exercises)
          </h3>
          <p>{part.description}</p>
        </div>
      );

    case "group":
      return (
        <div>
          <h3>
            {part.name} ({part.exerciseCount} exercises)
          </h3>
          <p>Group projects: {part.groupProjectCount}</p>
        </div>
      );

    case "background":
      return (
        <div>
          <h3>
            {part.name} ({part.exerciseCount} exercises)
          </h3>
          <p>{part.description}</p>
          <p>
            Background material:{" "}
            <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
          </p>
        </div>
      );

    case "special":
      return (
        <div>
          <h3>
            {part.name} ({part.exerciseCount} exercises)
          </h3>
          <p>{part.description}</p>
          <p>Required skills: {part.requirements.join(", ")}</p>
        </div>
      );

    default:
      return assertNever(part);
  }
};

export default Part;
