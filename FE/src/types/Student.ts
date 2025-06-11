import { HealthProfile } from "./HealthProfile";
import { MedicalHealthCheckupRecord } from "./MedicalRecord";
import { SchoolClassStudent } from "./SchoolClass";


export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  studentClass: SchoolClassStudent;
  image: string | null;
  healthProfile: HealthProfile;
  healthCheckupRecords: MedicalHealthCheckupRecord[] | null;
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


