import { HealthProfile } from "./HealthProfile";
import { SchoolClassStudent } from "./SchoolClass";


export interface Student {
  id: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  studentClass: SchoolClassStudent;
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


