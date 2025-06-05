import { HealthProfile } from "./HealthProfile";

export interface SchoolClass {
  id: string;
  className: string;
  classRoom: string;
  quantity: number;
}

export interface Student {
  id: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  studentClass: SchoolClass;
  image: string | null;
  healthProfile: HealthProfile
}

export interface StudentCreate {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  image: File | null;
}

export interface StudentUpdate {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  image: File | null;
}


