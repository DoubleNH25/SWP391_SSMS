export interface IncidentCreateViewModel {
    studentId: string;
    type: string;
    description: string;
    incidentDate: string;
    medicalUsageDetails : MedicalUsageDetail[]
}

export interface MedicalUsageDetail {
    medicalStockId: string;
    dosage: string;
    quantity: number;
}


