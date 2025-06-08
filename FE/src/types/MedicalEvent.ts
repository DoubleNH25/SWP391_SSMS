export interface MedicalEventUpdateCreateViewModel{
    name : string;
    description: string;
    scheduledDate: string;
    classIds: [string]
}

export interface MedicalEventViewModel{
    id: string;
    userId: string;
    name : string;
    description: string;
    scheduledDate: Date;
    status: "Pending" | "Approved" | "Rejected";
    classIds: [string];
}

