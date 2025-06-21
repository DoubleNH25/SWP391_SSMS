export interface MedicalViewModel {
    id: string;
    name: string;
    quantity: number;
    expiryDate: string;
    detailInformation: string;
}

export interface MedicalCreateViewModel {
    name: string;
    quantity: number;
    expiryDate: string;
    detailInformation: string;
}

export interface MedicalUpdateViewModel {
    name: string;
    quantity: number;
    expiryDate: string;
    detailInformation: string;
    status: "Available" | "OutOfStock";
}

export interface MedicalAccess {
    conselingScheduleId: string;
    status: string;
}