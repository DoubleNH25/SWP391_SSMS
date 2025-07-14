export interface IncidentCreateViewModel {
  studentId: string;
  type: string;
  description: string;
  incidentDate: string;
  medicalUsageDetails: MedicalUsageCreate[];
}

export interface MedicalUsageDetail {
  id: string;
  medicalName: string;
  dosage: string;
  quantity: number;
  // Thêm các trường khác nếu có
}

// Thêm type cho tạo mới (không có id, medicalName)
export interface MedicalUsageCreate {
  medicalStockId: string;
  dosage: string;
  quantity: number;
}

export interface Incident {
  id: string;
  studentId?: string;
  studentName?: string;
  class?: string;
  type: string;
  description?: string;
  note?: string;
  details?: string;
  status: string;
  incidentDate?: string;
  createdTime?: string;
  medicalUsageDetails?: MedicalUsageDetail[];
}
