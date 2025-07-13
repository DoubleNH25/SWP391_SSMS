export interface MedicalRequestItems {
  medicationName: string;
  form: string;
  dosage: string;
  route: string;
  frequency: number;
  totalQuantity: number;
  timeToAdminister: string[];
  startDate: string;
  endDate: string;
  notes: string;
  image?: string; // Thêm trường image cho đúng API
}

export interface MedicalRequestCreateUpdateViewModel {
  studentId: string;
  parentId: string;
  medicalRequestItems: MedicalRequestItems[];
}

export interface ListMedicalRequestViewModel {
  id: string;
  studentName: string;
  studentClass: string;
  parentName: string;
  medicationName: string;
  form: string;
  dosage: string;
  frequency: number;
  totalQuantity: number;
  remainingQuantity: number;
  timeToAdminister: string[];
  startDate: string;
  endDate: string;
  status: string;
  createdTime: string;
  totalAdministrations: number;
  completedAdministrations: number;
  lastAdministeredAt: string;
}

export interface MedicalRequestViewModel {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  parentId: string;
  parentName: string;
  phoneNumber: string;
  userId: string;
  nurseName: string;
  medicationName: string;
  totalQuantity: number;
  remainingQuantity: number;
  timeToAdminister: string[];
  startDate: string;
  endDate: string;
  notes: string;
  status: string;
  createdTime: string;
  administrations: MedicationAdministrationViewModel[];
}

export interface MedicationAdministrationViewModel {
  id: string;
  administeredBy: string;
  administratorName: string;
  administeredAt: string;
  doseGiven: string;
  wasTaken: boolean;
  notes: string;
}
