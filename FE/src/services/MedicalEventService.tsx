import { MedicalEventUpdateCreateViewModel, MedicalEventViewModel } from "@/types/MedicalEvent";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateMedicalEvent(medicalEvent: MedicalEventUpdateCreateViewModel): Promise<MedicalEventViewModel> {
    if (!medicalEvent || !medicalEvent.scheduledDate || !medicalEvent.description) {
        console.error("Invalid medical event data: title and description are required.");
        return null;
    }
    try {
        var response = await ApiClient<MedicalEventViewModel>({
            method: 'POST',
            endpoint: '/medical-events/health-activities',
            data: medicalEvent,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to create medical event:", err);
        return null;
    }
}

export async function FecthUpdateMedicalEvent(id: string, medicalEvent: MedicalEventUpdateCreateViewModel): Promise<boolean> {
    if (!id || !medicalEvent) {
        console.error("Invalid update request: missing id or data.");
        return false;
    }
    try {
        await ApiClient<MedicalEventUpdateCreateViewModel>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}`,
            data: medicalEvent,
        });
        return true;
    } catch (err) {
        console.error(`Failed to update medical event: ${err}`);
        return false;
    }
}

export async function FecthMedicalEvent(): Promise<MedicalEventViewModel[]> {
    try {
        const response = await ApiClient<MedicalEventViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/health-activities/all`,
        });
        return response?.data || [];
    } catch (err) {
        console.error(`Failed to get medical event: ${err}`);
        return [];
    }
}

export async function FecthPendingMedicalEvent(): Promise<MedicalEventViewModel[]> {
    try {
        const response = await ApiClient<MedicalEventViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/health-activities/pending`,
        });
        return response?.data || [];
    } catch (err) {
        console.error(`Failed to pending medical event: ${err}`);
        return [];
    }
}

export async function FecthApproveMedicalEvent(id: string): Promise<boolean> {
    if (!id) {
        console.error("Invalid ID provided for approving medical event.");
        return false;
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}/approve`,
        });
        return true;
    } catch (err) {
        console.error(`Failed to approved medical event: ${err}`);
        return false;
    }
}

export async function FecthApproveMedicalEvents(): Promise<MedicalEventViewModel[]> {
    try {
        const response = await ApiClient<MedicalEventViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/health-activities/approved`,
        });
        return response?.data || [];
    } catch (err) {
        console.error(`Failed to get approve medical event: ${err}`);
        return [];
    }
}


export async function FecthDeleteMedicalEvents(id: string,): Promise<boolean> {
    if (!id) {
        console.error("Invalid ID for deletion.");
        return false;
    }
    try {
        await ApiClient<void>({
            method: 'DELETE',
            endpoint: `/medical-events/health-activities/${id}`
        });
        return true;
    } catch (err) {
        console.error("Failed to delete medical event:", err);
        return false;
    }
}