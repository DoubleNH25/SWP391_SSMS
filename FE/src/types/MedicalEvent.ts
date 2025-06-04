export interface MedicalEventUpdateCreateViewModel{
    name : string;
    description: string;
    scheduledDate: string;
}

export interface MedicalEventViewModel{
    id: string;
    name : string;
    description: string;
    scheduledDate: Date;
    isAccepted: boolean
}

