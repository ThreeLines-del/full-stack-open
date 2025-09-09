import { useEffect, useState } from "react";
import DiaryEntries from "./components/DiaryEntries";
import diaryService from "./services/diaryService";
import type { DiaryType } from "./types";
import NewEntry from "./components/NewEntry";

function App() {
  const [diaries, setDiaries] = useState<DiaryType[]>([]);

  useEffect(() => {
    diaryService.getAll().then((data) => setDiaries(data));
  }, []);

  return (
    <div>
      <NewEntry setDiaries={setDiaries} />
      <DiaryEntries diaries={diaries} />
    </div>
  );
}

export default App;
