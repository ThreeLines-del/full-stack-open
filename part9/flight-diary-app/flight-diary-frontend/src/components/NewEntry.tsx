import { useState } from "react";
import type { DiaryType, NewDiaryType } from "../types";
import diaryService from "../services/diaryService";
import axios from "axios";

interface NewEntryProps {
  setDiaries: React.Dispatch<React.SetStateAction<DiaryType[]>>;
}

const NewEntry = ({ setDiaries }: NewEntryProps) => {
  const [diary, setDiary] = useState<NewDiaryType>({
    date: "",
    comment: "",
    visibility: "great",
    weather: "sunny",
  });
  const [error, setError] = useState<string>("");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDiary((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newDiary = await diaryService.add(diary);
      setDiaries((prev) => [...prev, newDiary]);
      setDiary((prev) => ({
        ...prev,
        date: "",
        comment: "",
        visibility: "",
        weather: "",
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.split("wrong. ")[1]);
        setTimeout(() => {
          setError("");
        }, 5000);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2>Add new entry</h2>
        {error ? <h4 style={{ color: "red" }}>{error}</h4> : null}
        date
        <input
          name="date"
          value={diary.date}
          onChange={handleOnChange}
          type="date"
        />
        <br />
        visibility
        <>
          <input
            type="radio"
            id="great"
            name="visibility"
            value="great"
            onChange={handleOnChange}
            defaultChecked
          />
          <label htmlFor="great">great</label>
          <input
            type="radio"
            id="good"
            name="visibility"
            value="good"
            onChange={handleOnChange}
          />
          <label htmlFor="good">good</label>
          <input
            type="radio"
            id="ok"
            name="visibility"
            value="ok"
            onChange={handleOnChange}
          />
          <label htmlFor="ok">ok</label>
          <input
            type="radio"
            id="poor"
            name="visibility"
            value="poor"
            onChange={handleOnChange}
          />
          <label htmlFor="poor">poor</label>
        </>
        <br />
        weather
        <>
          <input
            type="radio"
            id="sunny"
            name="weather"
            value="sunny"
            onChange={handleOnChange}
            defaultChecked
          />
          <label htmlFor="sunny">sunny</label>
          <input
            type="radio"
            id="rainy"
            name="weather"
            value="rainy"
            onChange={handleOnChange}
          />
          <label htmlFor="rainy">rainy</label>
          <input
            type="radio"
            id="cloudy"
            name="weather"
            value="cloudy"
            onChange={handleOnChange}
          />
          <label htmlFor="cloudy">cloudy</label>
          <input
            type="radio"
            id="stormy"
            name="weather"
            value="stormy"
            onChange={handleOnChange}
          />
          <label htmlFor="stormy">stormy</label>
          <input
            type="radio"
            id="windy"
            name="weather"
            value="windy"
            onChange={handleOnChange}
          />
          <label htmlFor="windy">windy</label>
        </>
        <br />
        comment{" "}
        <input
          name="comment"
          value={diary.comment}
          onChange={handleOnChange}
          type="text"
        />
        <br />
        <button>add</button>
      </form>
    </div>
  );
};

export default NewEntry;
