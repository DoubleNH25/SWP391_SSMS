import { HealthProfileUpdate, Student } from "@/types/HealthProfile";
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
    console.error('Invalid student ID:', studentId);
    return false;
  }

  if (!profile || typeof profile !== 'object') {
    console.error('Invalid profile data:', profile);
    return false;
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
    return false;
  }
}



