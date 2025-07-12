import { ConselingSchedules } from "@/types/ConselingSchedules";
import {
  HealthProfile,
  HealthProfileUpdate,
  Student,
} from "@/types/HealthProfile";
import {
  MedicalHealthCheckupRecord,
  MedicalVaccinationRecord,
} from "@/types/MedicalRecord";
import ApiClient from "@/utils/ApiBase";

export async function FecthHealthProfile(): Promise<Student[]> {
  if (!localStorage.getItem("token")) {
    console.error("User is not authenticated");
    return [];
  }
  try {
    const response = await ApiClient<Student[]>({
      method: "GET",
      endpoint: "/parents/students",
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get health profile: ${err}`);
    return [];
  }
}

export async function FecthUpdateHealthProfile(
  studentId: string,
  profile: HealthProfileUpdate
): Promise<boolean> {
  if (!studentId || typeof studentId !== "string") {
    throw new Error("Student ID is required");
  }

  if (!profile || typeof profile !== "object") {
    throw new Error("Invalid health profile data");
  }
  try {
    await ApiClient<HealthProfileUpdate>({
      method: "PUT",
      endpoint: `/parents/students/${studentId}/health-profile`,
      data: profile,
    });
    return true;
  } catch (err) {
    console.error(`Failed to update health profile: ${err}`);
    throw new Error("Unable to update health profile. Please try again.");
  }
}

export async function FecthHealthCheckup(): Promise<
  MedicalHealthCheckupRecord[]
> {
  if (!localStorage.getItem("token")) {
    console.error("User is not authenticated");
    return [];
  }
  try {
    const response = await ApiClient<MedicalHealthCheckupRecord[]>({
      method: "GET",
      endpoint: "/parents/get-all-student-health-checkup",
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get health profile: ${err}`);
    return [];
  }
}

export async function FecthVaccinationRecords(): Promise<
  MedicalVaccinationRecord[]
> {
  if (!localStorage.getItem("token")) {
    console.error("User is not authenticated");
    return [];
  }
  try {
    const response = await ApiClient<MedicalVaccinationRecord[]>({
      method: "GET",
      endpoint: "/parents/get-all-vaccination-records",
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get health profile: ${err}`);
    return [];
  }
}

export async function FecthCreateConselingSchedule(
  data: ConselingSchedules
): Promise<boolean> {
  if (
    !data ||
    !data.studentId ||
    !data.healthCheckupId ||
    !data.requestedDate
  ) {
    throw new Error("Please enter complete conseling schedule information");
  }
  try {
    await ApiClient<ConselingSchedules>({
      method: "POST",
      endpoint: "/nurse/conseling-schedules",
      data: data,
    });
    return true;
  } catch (err) {
    console.error("Failed to create conseling schedule:", err);
    throw new Error("Unable to create conseling schedule. Please try again.");
  }
}

export async function FecthHealthProfileByStudentId(
  studentId: string
): Promise<HealthProfile | null> {
  if (!localStorage.getItem("token")) {
    console.error("User is not authenticated");
    return null;
  }
  try {
    const response = await ApiClient<HealthProfile>({
      method: "GET",
      endpoint: `/nurse/health-profiles/${studentId}`,
    });
    return response?.data || null;
  } catch (err) {
    console.error(`Failed to get health profile: ${err}`);
    return null;
  }
}

export async function FecthUpdateHealthProfileNurse(
  studentId: string,
  profile: HealthProfileUpdate
): Promise<boolean> {
  if (!studentId || typeof studentId !== "string") {
    throw new Error("Student ID is required");
  }

  if (!profile || typeof profile !== "object") {
    throw new Error("Invalid health profile data");
  }
  try {
    await ApiClient<HealthProfileUpdate>({
      method: "PUT",
      endpoint: `/nurse/health-profiles/${studentId}`,
      data: profile,
    });
    return true;
  } catch (err) {
    console.error(`Failed to update health profile: ${err}`);
    throw new Error("Unable to update health profile. Please try again.");
  }
}

export async function DeleteHealthProfile(studentId: string): Promise<boolean> {
  if (!localStorage.getItem("token")) {
    throw new Error("User is not authenticated");
  }
  try {
    await ApiClient({
      method: "DELETE",
      endpoint: `/nurse/health-profiles/${studentId}`,
    });
    return true;
  } catch (err) {
    console.error(`Failed to delete health profile: ${err}`);
    throw new Error("Unable to delete health profile. Please try again.");
  }
}

export async function FecthCreateHealthProfile(
  studentId: string,
  data: HealthProfileUpdate
): Promise<boolean> {
  if (!data || !studentId) {
    throw new Error("Please enter complete health profile information");
  }
  try {
    await ApiClient<HealthProfileUpdate>({
      method: "POST",
      endpoint: `/nurse/health-profiles?studentId=${studentId}`,
      data: data,
    });
    return true;
  } catch (err) {
    console.error("Failed to create health profile:", err);
    throw new Error("Unable to create health profile. Please try again.");
  }
}
