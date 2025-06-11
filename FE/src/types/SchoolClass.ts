import { Student } from "./Student";

export interface SchoolClass {
  id: string;
  className: string;
  classRoom: string;
  quantity: number;
  students: Student[]
}

export interface SchoolClassStudent {
  id: string;
  className: string;
  classRoom: string;
  quantity: number;
}

export interface SchoolClassCreateUpdateViewModel {
  className: string;
  classRoom: string;
  quantity: number;
}