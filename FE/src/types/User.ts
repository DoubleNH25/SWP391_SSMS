import { SchoolClass } from "./SchoolClass";

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  roleName: string;
  imageUrl: string | null;
}


export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  image: string | null;
}

export interface UserProfileUpdateViewModel {
  fullName: string;
  phone: string;
  image: File | null;
}


export interface UserCreate {
  email: string;
  phone: string;
  fullName: string;
  roleId: string;
  password: string;
}

export interface UserUpdate {
  email: string;
  phone: string;
  fullName: string;
  password: string;
}

export interface ParentViewModel extends User {
  students: Student
}

export interface Student {
  id: string;
  studentCode: string;
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

export interface VerifyOTPRequest {
  idToken: string;
  phoneNumber: string;
}

export interface VerifyOTPEmailRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string; 
  resetToken: string; 
  newPassword: string; 
  verifyPassword: string;
}