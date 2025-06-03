export interface MedicalEventUpdateCreateViewModel{
    name : string;
    description: string;
    scheduledDate: Date;
}

export interface MedicalEventViewModel{
    id: string;
    name : string;
    description: string;
    scheduledDate: Date;
    isAccepted: boolean
}

