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


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}