export interface VaccinationCampaignsUpdateCreateViewModel{
    name : string;
    vaccineName: string;
    exp: string;
    mfg: string;
    vaccineType: string;
    startDate: string;
    classIds: [string]
}

export interface VaccinationCampaignsViewModel{
    id: string;
    name : string;
    vaccineName: string;
    exp: Date;
    mfg: Date;
    vaccineType: string;
    startDate: Date;
    status:  "Pending" | "Approved" | "Rejected";
    classIds: [string]
}
