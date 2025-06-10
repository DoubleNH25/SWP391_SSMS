export interface MedicalVaccinationRecord {
    id: string;
    studentId: string;
    studentName: string;
    vaccinationCampaignId: string;
    vaccineName: string;
    resultNote: string;
    time: string;
    vaccinatedAt: string;
}

export interface VaccinationRecord {
    resultNote: string;
    vaccinatedAt: string;
}

export interface MedicalHealthCheckupRecord {
    healthCheckUpId: string;
    healthActivityId: string;
    studentId: string;
    studentName: string;
    nurseId: string;
    nurseName: string;
    vision: string;
    hearing: string;
    dental: string;
    bmi: number;
    abnormalNote: string;
    time: string;
    recordDate: string;
    isLate: boolean;
}

export interface HealthCheckupRecord {
    vision: string;
    hearing: string;
    dental: string;
    bmi: number;
    abnormalNote: string;
}