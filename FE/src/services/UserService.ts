import { Student, StudentCreate, StudentUpdate } from "@/types/Student";
import { ParentViewModel, User, UserCreate, UserProfile, UserProfileUpdateViewModel, UserUpdate } from "@/types/User";
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
    throw new Error("Email and password are required");
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
    throw new Error("Unable to create user. Please try again.");
  }
}

export async function FecthUpdateUsers(userId: string, users: UserUpdate): Promise<boolean> {
  if (!userId) {
    throw new Error("User ID is required");
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
    throw new Error("Unable to update user. Please try again.");
  }
}

export async function FecthUserById(userId: string): Promise<UserUpdate | null> {
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
    throw new Error("User ID is required");
  }
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/users/${userId}`,
    });
    return true;
  } catch (err) {
    console.error("Failed to delete user:", err);
    throw new Error("Unable to delete user. Please try again.");
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

export async function FecthStudentById(studentId: string): Promise<Student | null> {
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
    throw new Error("Parent ID is required");
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
    throw new Error("Unable to create student. Please try again.");
  }
}

export async function FecthUpdateStudents(studentId: string, students: StudentUpdate): Promise<boolean> {
  if (!studentId) {
    throw new Error("Student ID is required");
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
    throw new Error("Unable to update student. Please try again.");
  }
}

export async function FecthDeleteStudents(studentId: string): Promise<boolean> {
  if (!studentId) {
    throw new Error("Student ID is required");
  }
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/users/students/${studentId}`,
    });
    return true;
  } catch (err) {
    console.error("Failed to delete student:", err);
    throw new Error("Unable to delete student. Please try again.");
  }
}

export async function FecthParents(): Promise<ParentViewModel[]> {
  try {
    const response = await ApiClient<ParentViewModel[]>({
      method: 'GET',
      endpoint: `/users/parents/get-all-parent`,
    });
    return response?.data || [];
  } catch (err) {
    console.error("Failed to get all parent:", err);
    return [];
  }
}

export async function FecthStudentsByParentId(parentId: string): Promise<Student[]> {
  if (!parentId) {
    console.error("Parent ID is required to get students.");
    return [];
  }
  try {
    const response = await ApiClient<Student[]>({
      method: 'GET',
      endpoint: `/users/parents/${parentId}/students`,
    });
    return response?.data || [];
  } catch (err) {
    console.error("Failed to get students by parent ID:", err);
    return [];
  }
}

export async function FecthStudentByCode(studentCode : string): Promise<Student | null> {
  try {
    const response = await ApiClient<Student>({
      method: 'GET',
      endpoint: `/users/students/code/${studentCode}`,
    });
    return response?.data || null;
  } catch (err) {
    console.error("Failed to get student by code:", err);
    return null;
  }
}

//========================================API PROFILE===========================================/

export async function FecthUsersProfile(): Promise<UserProfile | null> {
  try {
    const response = await ApiClient<UserProfile>({
      method: 'GET',
      endpoint: '/users/profile',
    });
    return response?.data || null;
  } catch (err) {
    console.error("Failed to get users profile:", err);
    return null;
  }
}

export async function FecthUpdateProfile(userProfile: UserProfileUpdateViewModel): Promise<boolean> {
  try {
    await ApiClient<string>({
      method: 'PUT',
      endpoint: `/users/profile`,
      data: userProfile,
      contentType: 'multipart/form-data',
    });
    return true;
  } catch (err) {
    console.error("Failed to update profile:", err);
    throw new Error("Failed to update profile.");
  }
}


