import { HealthProfileUpdate, Student } from "@/types/HealthProfile";
import ApiClient from "@/utils/ApiBase";

export async function FecthHealthProfile(): Promise<Student[]> {
  try {
    const response = await ApiClient<Student[]>({
      method: 'GET',
      endpoint: '/parents/students',
    });
    return response.data;
  } catch (err) {
    throw new Error(`Failed to get health profile: ${err}`);
  }
}

export async function FecthUpdateHealthProfile(studentId: string, profile: HealthProfileUpdate): Promise<void> {
  try {
    await ApiClient<HealthProfileUpdate>({
      method: 'PUT',
      endpoint: `/parents/students/${studentId}/health-profile`,
      data: profile
    });
  } catch (err) {
    throw new Error(`Failed to update health profile: ${err}`);
  }
}



