import { MedicalEventUpdateCreateViewModel, MedicalEventViewModel } from "@/types/MedicalEvent";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateMedicalEvent(medicalEvent: MedicalEventUpdateCreateViewModel): Promise<MedicalEventViewModel> {
    try {
        var response = await ApiClient<MedicalEventViewModel>({
            method: 'POST',
            endpoint: '/medical-events/health-activities',
            data: medicalEvent,
        });
        return response.data;
    } catch (err) {
        throw new Error(`Failed to create medical event: ${err}`);
    }
}

export async function FecthUpdateMedicalEvent(id: string, medicalEvent: MedicalEventUpdateCreateViewModel): Promise<void> {
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}`,
            data: medicalEvent,
        });
    } catch (err) {
        throw new Error(`Failed to update medical event: ${err}`);
    }
}

export async function FecthMedicalEvent(): Promise<MedicalEventViewModel[]> {
    try {
        const response = await ApiClient<MedicalEventViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/health-activities/all`,
        });
        return response.data;
    } catch (err) {
        throw new Error(`Failed to get medical event: ${err}`);
    }
}

export async function FecthPendingMedicalEvent(): Promise<MedicalEventViewModel[]> {
    try {
        const response = await ApiClient<MedicalEventViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/health-activities/pending`,
        });
        return response.data;
    } catch (err) {
        throw new Error(`Failed to pending medical event: ${err}`);
    }
}

export async function FecthApproveMedicalEvent(id: string): Promise<void> {
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}/approve`,
        });
    } catch (err) {
        throw new Error(`Failed to approved medical event: ${err}`);
    }
}

export async function FecthApproveMedicalEvents(): Promise<MedicalEventViewModel[]> {
    try {
        const response = await ApiClient<MedicalEventViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/health-activities/approved`,
        });
        return response.data;
    } catch (err) {
        throw new Error(`Failed to get approve medical event: ${err}`);
    }
}


export async function FecthDeleteMedicalEvents(id: string,): Promise<void> {
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/medical-events/health-activities/${id}`
    });
  } catch (err) {
    throw new Error(`Failed to delete medical event: ${err}`);
  }
}