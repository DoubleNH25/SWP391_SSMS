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
    throw new Error("Email và mật khẩu là bắt buộc");
  }
  try {
    await ApiClient<string>({
      method: 'POST',
      endpoint: '/users',
      data: users,
    });
    return true;
  } catch (err: any) {
    console.error(`Failed to create user: ${err}`);
    throw new Error("Không thể tạo người dùng. Vui lòng thử lại.");
  }
}

export async function FecthUpdateUsers(userId: String, users: UserUpdate): Promise<boolean> {
  if (!userId) {
    throw new Error("ID người dùng là bắt buộc");
  }
  try {
    await ApiClient<string>({
      method: 'PUT',
      endpoint: `/users/${userId}`,
      data: users,
    });
    return true;
  } catch (err: any) {
    console.error(`Failed to update user: ${err}`);
    throw new Error("Không thể cập nhật người dùng. Vui lòng thử lại.");
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
    throw new Error("ID người dùng là bắt buộc");
  }
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/users/${userId}`,
    });
    return true;
  } catch (err: any) {
    console.error("Failed to delete user:", err);
    throw new Error("Không thể xóa người dùng. Vui lòng thử lại.");
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
    throw new Error("ID phụ huynh là bắt buộc");
  }
  try {
    await ApiClient<string>({
      method: 'POST',
      endpoint: `/users/students?parentId=${parentId}`,
      data: students,
      contentType: 'multipart/form-data',
    });
    return true;
  } catch (err: any) {
    console.error("Failed to create student:", err);
    throw new Error("Không thể tạo học sinh. Vui lòng thử lại.");
  }
}

export async function FecthUpdateStudents(studentId: String, students: StudentUpdate): Promise<boolean> {
  if (!studentId) {
    throw new Error("ID học sinh là bắt buộc");
  }
  try {
    await ApiClient<string>({
      method: 'PUT',
      endpoint: `/users/students/${studentId}`,
      data: students,
      contentType: 'multipart/form-data',
    });
    return true;
  } catch (err: any) {
    console.error("Failed to update student:", err);
    throw new Error("Không thể cập nhật học sinh. Vui lòng thử lại.");
  }
}

export async function FecthDeleteStudents(studentId: string): Promise<boolean> {
  if (!studentId) {
    throw new Error("ID học sinh là bắt buộc");
  }
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/users/students/${studentId}`,
    });
    return true;
  } catch (err: any) {
    console.error("Failed to delete student:", err);
    throw new Error("Không thể xóa học sinh. Vui lòng thử lại.");
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

//========================================API PROFILE===========================================/

export async function FecthUsersProfile(): Promise<UserProfile> {
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
  } catch (err: any) {
    console.error("Failed to update profile:", err);
    throw new Error("Failed to update profile.");
  }
}
