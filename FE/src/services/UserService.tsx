import { Student, StudentCreate, StudentUpdate } from "@/types/Student";
import { User, UserCreate, UserUpdate } from "@/types/User";
import ApiClient from "@/utils/ApiBase";


export async function FecthUsers(): Promise<User[]> {
  try {
    const response = await ApiClient<User[]>({
      method: 'GET',
      endpoint: '/users',
    });
    return response.data;
  } catch (err) {
    throw new Error(`Failed to create user: ${err}`);
  }
}

export async function FecthCreateUsers(users: UserCreate): Promise<void> {
  try {
    await ApiClient<string>({
      method: 'POST',
      endpoint: '/users',
      data: users,
    });
  } catch (err) {
    throw new Error(`Failed to create user: ${err}`);
  }
}

export async function FecthUpdateUsers(userId: String, users: UserUpdate): Promise<void> {
  try {
    await ApiClient<string>({
      method: 'PUT',
      endpoint: `/users/${userId}`,
      data: users,
    });
  } catch (err) {
    throw new Error(`Failed to update user: ${err}`);
  }
}

export async function FecthUserById(users: string): Promise<UserUpdate> {
  try {
    const response = await ApiClient<UserUpdate>({
      method: 'GET',
      endpoint: `/users/${users}`,
      data: users,
    });
    return response.data;
  } catch (err) {
    throw new Error(`Failed to update user: ${err}`);
  }
}

export async function FecthDeleteUsers(userId: string): Promise<void> {
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/users/${userId}`,
    });
  } catch (err) {
    throw new Error(`Failed to delete user: ${err}`);
  }
}

//========================================API STUDENT===========================================/

export async function FecthImportUserByExcel(file: File): Promise<void> {
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const r = await ApiClient<string>({
      method: 'POST',
      endpoint: `/users/import-students`,
      data: formData,
      contentType: 'multipart/form-data',
    });
  } catch (err) {
    throw new Error(`Failed to update user: ${err}`);
  }
}



export async function FecthStudents(): Promise<Student[]> {
  try {
    const response = await ApiClient<Student[]>({
      method: 'GET',
      endpoint: `/users/students`,
    });
    return response.data;
  } catch (err) {
    throw new Error(`Failed to delete user: ${err}`);
  }
}

export async function FecthCreateStudents(parentId: string, students: StudentCreate): Promise<void> {
  try {
    await ApiClient<string>({
      method: 'POST',
      endpoint: `/users/students/${parentId}`,
      data: students,
      contentType: 'multipart/form-data',
    });
  } catch (err) {
    throw new Error(`Failed to delete user: ${err}`);
  }
}

export async function FecthUpdateStudents(studentId: String, students: StudentUpdate): Promise<void> {
  try {
    await ApiClient<string>({
      method: 'PUT',
      endpoint: `/students/${studentId}`,
      data: students,
    });
  } catch (err) {
    throw new Error(`Failed to update user: ${err}`);
  }
}

export async function FecthDeleteStudents(studentId: string): Promise<void> {
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/users/students/${studentId}`,
    });
  } catch (err) {
    throw new Error(`Failed to delete user: ${err}`);
  }
}