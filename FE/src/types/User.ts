import { HealthProfile } from "./HealthProfile";

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  roleName: string;
  imageUrl: string | null;
}

export interface UserCreate {
  email: string;
  phone: string;
  fullName: string;
  roleId: string;
  password: string;
}

export interface UserUpdate{
  email: string;
  phone: string;
  fullName: string;
  password: string;
}

export interface ParentViewModel extends User{
  students: Student
}

export interface SchoolClass {
  id: string;
  className: string;
  classRoom: string;
  quantity: number;
  strudent: []
}

export interface Student {
  id: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  studentClass: SchoolClass;
  image: string | null;
  healthProfile: string;
  healthCheckupRecords: string;
}



export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}