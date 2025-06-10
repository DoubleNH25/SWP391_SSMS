import { ConselingSchedules } from "@/types/ConselingSchedules";
import { HealthProfileUpdate, Student } from "@/types/HealthProfile";
import { MedicalEventViewModel } from "@/types/MedicalEvent";
import { MedicalHealthCheckupRecord } from "@/types/MedicalRecord";
import ApiClient from "@/utils/ApiBase";

export async function FecthHealthProfile(): Promise<Student[]> {
  if (!localStorage.getItem('token')) {
    console.error('User is not authenticated');
    return [];
  }
  try {
    const response = await ApiClient<Student[]>({
      method: 'GET',
      endpoint: '/parents/students',
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get health profile: ${err}`);
    return [];
  }
}

export async function FecthUpdateHealthProfile(studentId: string, profile: HealthProfileUpdate): Promise<boolean> {
  if (!studentId || typeof studentId !== 'string') {
    throw new Error('Student ID is required');
  }

  if (!profile || typeof profile !== 'object') {
    throw new Error('Invalid health profile data');
  }
  try {
    await ApiClient<HealthProfileUpdate>({
      method: 'PUT',
      endpoint: `/parents/students/${studentId}/health-profile`,
      data: profile
    });
    return true;
  } catch (err) {
    console.error(`Failed to update health profile: ${err}`);
    throw new Error('Unable to update health profile. Please try again.');
  }
}

export async function FecthHealthCheckup(): Promise<MedicalHealthCheckupRecord[]> {
  if (!localStorage.getItem('token')) {
    console.error('User is not authenticated');
    return [];
  }
  try {
    const response = await ApiClient<MedicalHealthCheckupRecord[]>({
      method: 'GET',
      endpoint: '/parents/get-all-student-health-checkup',
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get health profile: ${err}`);
    return [];
  }
}


export async function FecthCreateConselingSchedule(data: ConselingSchedules): Promise<boolean> {
  if (!data || !data.studentId || !data.healthCheckupId || !data.requestDate) {
      throw new Error("Please enter complete conseling schedule information");
  }
  try {
      await ApiClient<ConselingSchedules>({
          method: 'POST',
          endpoint: '/parents/conseling-schedules',
          data: data,
      });
      return true;
  } catch (err) {
      console.error("Failed to create conseling schedule:", err);
      throw new Error("Unable to create conseling schedule. Please try again.");
  }
}


