export interface IncidentCreateViewModel {
  studentId: string;
  type: string;
  description: string;
  incidentDate: string;
  medicalUsageDetails: MedicalUsageDetail[];
}

export interface MedicalUsageDetail {
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
}
