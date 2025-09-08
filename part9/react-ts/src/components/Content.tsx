import React from "react";
import Part from "./Part";
import type { CoursePart } from "../App";

interface ContentProps {
  courseParts: CoursePart[];
}

const Content: React.FC<ContentProps> = ({ courseParts }) => {
  return (
    <>
      {courseParts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </>
  );
};

export default Content;
