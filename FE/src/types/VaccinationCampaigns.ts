export interface VaccinationCampaignsUpdateCreateViewModel{
    name : string;
    vaccineName: string;
    exp: string;
    mfg: string;
    vaccineType: string;
    startDate: string;
}

export interface VaccinationCampaignsViewModel{
    id: string;
    name : string;
    vaccineName: string;
    exp: Date;
    mfg: Date;
    vaccineType: string;
    startDate: Date;
    isAccepted: boolean;
}
