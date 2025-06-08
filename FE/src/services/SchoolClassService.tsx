import { SchoolClass, SchoolClassCreateUpdateViewModel } from "@/types/SchoolClass";
import ApiClient from "@/utils/ApiBase";

export async function FecthClass(): Promise<SchoolClass[]> {
  try {
    const response = await ApiClient<SchoolClass[]>({
      method: 'GET',
      endpoint: `/school-classes`,
    });
    return response?.data || [];
  } catch (err) {
    console.error("Failed to get all parent:", err);
    return [];
  }
}

export async function FecthCreateSchoolClass(schoolClass : SchoolClassCreateUpdateViewModel): Promise<boolean> {
  if (!schoolClass || !schoolClass.className || !schoolClass.classRoom) {
    throw new Error("Tên lớp và phòng học là bắt buộc");
  }
  try {
    await ApiClient<string>({
      method: 'POST',
      endpoint: '/school-classes',
      data: schoolClass,
    });
    return true;
  } catch (err: any) {
    console.error(`Failed to create class: ${err}`);
    throw new Error("Không thể tạo lớp học. Vui lòng thử lại.");
  }
}

export async function FecthUpdateSchoolClass(schoolClassId: String, schoolClass: SchoolClassCreateUpdateViewModel): Promise<boolean> {
  if (!schoolClassId) {
    throw new Error("ID lớp học là bắt buộc");
  }
  try {
    await ApiClient<string>({
      method: 'PUT',
      endpoint: `/school-classes/${schoolClassId}`,
      data: schoolClass,
    });
    return true;
  } catch (err: any) {
    console.error(`Failed to update class: ${err}`);
    throw new Error("Không thể cập nhật lớp học. Vui lòng thử lại.");
  }
}

export async function FecthSchoolClassById(schoolClassId: string): Promise<SchoolClass> {
  if (!schoolClassId) {
    console.error("Class ID is required to get class.");
    return null;
  }
  try {
    const response = await ApiClient<SchoolClass>({
      method: 'GET',
      endpoint: `/school-classes/${schoolClassId}`,
    });
    return response?.data || null;
  } catch (err) {
    console.error("Failed to get class by ID:", err);
    return null;
  }
}

export async function FecthDeleteSchoolClass(schoolClassId: string): Promise<boolean> {
  if (!schoolClassId) {
    throw new Error("ID lớp học là bắt buộc");
  }
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/school-classes/${schoolClassId}`,
    });
    return true;
  } catch (err: any) {
    console.error("Failed to delete class:", err);
    throw new Error("Không thể xóa lớp học. Vui lòng thử lại.");
  }
}