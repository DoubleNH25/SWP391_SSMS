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



