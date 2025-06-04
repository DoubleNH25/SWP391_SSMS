import { Student, StudentCreate, StudentUpdate } from "@/types/Student";
import { User, UserCreate, UserUpdate } from "@/types/User";
import ApiClient from "@/utils/ApiBase";


export async function FecthUsers(): Promise<User[]> {
  try {
    const response = await ApiClient<User[]>({
      method: 'GET',
      endpoint: '/users',
    });
    return response?.data || [];
  } catch (err) {
    console.error("Failed to get users:", err);
    return [];
  }
}

export async function FecthCreateUsers(users: UserCreate): Promise<boolean> {
  if (!users || !users.email || !users.password) {
    console.error("Invalid user data: email and password are required.");
    return false;
  }
  try {
    await ApiClient<string>({
      method: 'POST',
      endpoint: '/users',
      data: users,
    });
    return true;
  } catch (err) {
    console.error(`Failed to create user: ${err}`);
    return false;
  }
}

export async function FecthUpdateUsers(userId: String, users: UserUpdate): Promise<boolean> {
  if (!userId) {
    console.error("User ID is required to update user.");
    return false;
  }
  try {
    await ApiClient<string>({
      method: 'PUT',
      endpoint: `/users/${userId}`,
      data: users,
    });
    return true;
  } catch (err) {
    console.error(`Failed to update user: ${err}`);
    return false;
  }
}

export async function FecthUserById(userId: string): Promise<UserUpdate> {
  if (!userId) {
    console.error("User ID is required to get user.");
    return null;
  }
  try {
    const response = await ApiClient<UserUpdate>({
      method: 'GET',
      endpoint: `/users/${userId}`,
      data: userId,
    });
    return response?.data || null;
  } catch (err) {
    console.error("Failed to get user by ID:", err);
    return null;
  }
}

export async function FecthDeleteUsers(userId: string): Promise<boolean> {
  if (!userId) {
    console.error("User ID is required to delete user.");
    return false;
  }
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/users/${userId}`,
    });
    return true;
  } catch (err) {
    console.error("Failed to delete user:", err);
    return false;
  }
}

//========================================API STUDENT===========================================/

export async function FecthImportUserByExcel(file: File): Promise<boolean> {
  if (!file) {
    console.error("File is required for import.");
    return false;
  }
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);

    await ApiClient<string>({
      method: 'POST',
      endpoint: `/users/import-students`,
      data: formData,
      contentType: 'multipart/form-data',
    });
    return true;
  } catch (err) {
    console.error("Failed to import users from Excel:", err);
    return false;
  }
}

export async function FecthStudents(): Promise<Student[]> {
  try {
    const response = await ApiClient<Student[]>({
      method: 'GET',
      endpoint: `/users/students`,
    });
    return response?.data || [];
  } catch (err) {
    console.error("Failed to get students:", err);
    return [];
  }
}

export async function FecthStudentById(studentId: string): Promise<Student> {
  if (!studentId) {
    console.error("Student ID is required to get student.");
    return null;
  }
  try {
    const response = await ApiClient<Student>({
      method: 'GET',
      endpoint: `/users/students/${studentId}`,
    });
    return response?.data || null;
  } catch (err) {
    console.error("Failed to get student by ID:", err);
    return null;
  }
}

export async function FecthCreateStudents(parentId: string, students: StudentCreate): Promise<boolean> {
  if (!parentId) {
    console.error("Parent ID is required to create student.");
    return false;
  }
  try {
    await ApiClient<string>({
      method: 'POST',
      endpoint: `/users/students?parentId=${parentId}`,
      data: students,
      contentType: 'multipart/form-data',
    });
    return true;
  } catch (err) {
    console.error("Failed to create student:", err);
    return false;
  }
}

export async function FecthUpdateStudents(studentId: String, students: StudentUpdate): Promise<boolean> {
  if (!studentId) {
    console.error("Student ID is required to update student.");
    return false;
  }
  try {
    await ApiClient<string>({
      method: 'PUT',
      endpoint: `/users/students/${studentId}`,
      data: students,
      contentType: 'multipart/form-data',
    });
    return true;
  } catch (err) {
    console.error("Failed to update student:", err);
    return false;
  }
}

export async function FecthDeleteStudents(studentId: string): Promise<boolean> {
  if (!studentId) {
    console.error("Student ID is required to delete student.");
    return false;
  }
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/users/students/${studentId}`,
    });
    return true;
  } catch (err) {
    console.error("Failed to delete student:", err);
    return false;
  }
}