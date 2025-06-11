export interface HealthProfile {
  id: string;
  studentId: string;
  vision: string;
  hearing: string;
  dental: string;
  bmi: number;
  abnormalNote: string;
  vaccinationHistory: string;
}

export interface ClassRoom{
  id: string;
  className: string;
  classRoom: string;
  quantity: number;
}

export interface Student {
  id: string;
  fullName: string;
  gender: string;
  dateOfBirth: string; 
  classId: string;
  studentClass: ClassRoom;
  image: string | null;
  healthProfile: HealthProfile;
}


export interface HealthProfileUpdate {
  vision: string;
  hearing: string;
  dental: string;
  bmi: number;
  abnormalNote: string;
  vaccinationHistory: string;
}
