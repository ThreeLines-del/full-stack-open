export interface DiaryType {
  id: string;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

export type NewDiaryType = Omit<DiaryType, "id">;
