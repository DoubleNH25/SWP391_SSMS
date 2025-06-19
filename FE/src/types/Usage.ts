export interface UsageCreateViewModel {
    medicalIncidentId: string;
    medicalUsageDetails: MedicalUsageDetail[];
}

export interface MedicalUsageDetail {
    medicalStockId: string;
    dosage: string;
    quantity: number;
}


