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
    healthCheckUpId: string | null;
    healthActivityId: string;
    studentId: string;
    studentName: string;
    nurseId: string;
    nurseName: string | null;
    vision: string;
    hearing: string;
    dental: string;
    height: number;
    weight: number;
    bmi: number;
    abnormalNote: string;
    time: string;
    recordDate: string;
    isLatest: boolean;
    checkingStatus: string
}

export interface HealthCheckupRecord {
    vision: string;
    hearing: string;
    dental: string;
    height: number;
    weight: number;
    bmi: number;
    abnormalNote: string;
    checkingStatus: "Normal" | "Abnormal"
}