import type { DiaryType } from "../types";

interface DiaryEntriesProps {
  diaries: DiaryType[];
}

const DiaryEntries = ({ diaries }: DiaryEntriesProps) => {
  return (
    <div>
      <h2>Diary Entries</h2>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>
            visibility: {diary.visibility} <br />
            weather: {diary.weather}
            <br />
            <strong>comment: </strong>
            {diary.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DiaryEntries;
