import axios from "axios";
import type { DiaryType, NewDiaryType } from "../types";
const baseUrl = "http://localhost:3000/api/diaries";

const getAll = async () => {
  const response = await axios.get<DiaryType[]>(baseUrl);
  return response.data;
};

const add = async (newObj: NewDiaryType) => {
  const response = await axios.post<DiaryType>(baseUrl, newObj);
  return response.data;
};

export default { getAll, add };
