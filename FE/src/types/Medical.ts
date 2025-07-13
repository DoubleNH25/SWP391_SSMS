export interface MedicalViewModel {
  id: string;
  name: string;
  quantity: number;
  expiryDate: string;
  detailInformation: string;
  supplier: string;
}

export interface MedicalCreateViewModel {
  name: string;
  quantity: number;
  expiryDate: string;
  detailInformation: string;
  supplier: string;
}

export interface MedicalUpdateViewModel {
  name: string;
  quantity: number;
  expiryDate: string;
  detailInformation: string;
  supplier: string;
  status: "Available" | "OutOfStock";
}

export interface MedicalAccess {
  conselingScheduleId: string;
  status: string;
  parentRejectNote?: string;
}
