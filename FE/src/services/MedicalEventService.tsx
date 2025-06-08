import { MedicalEventUpdateCreateViewModel, MedicalEventViewModel } from "@/types/MedicalEvent";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateMedicalEvent(medicalEvent: MedicalEventUpdateCreateViewModel): Promise<MedicalEventViewModel> {
    if (!medicalEvent || !medicalEvent.scheduledDate || !medicalEvent.description) {
        throw new Error("Please enter complete medical event information");
    }
    try {
        const response = await ApiClient<MedicalEventViewModel>({
            method: 'POST',
            endpoint: '/medical-events/health-activities',
            data: medicalEvent,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to create medical event:", err);
        throw new Error("Unable to create medical event. Please try again.");
    }
}

export async function FecthUpdateMedicalEvent(id: string, medicalEvent: MedicalEventUpdateCreateViewModel): Promise<boolean> {
    if (!id || !medicalEvent) {
        throw new Error("ID and medical event data are required");
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
        throw new Error("Unable to update medical event. Please try again.");
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

export async function FecthRejectMedicalEvents(): Promise<MedicalEventViewModel[]> {
    try {
        const response = await ApiClient<MedicalEventViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/health-activities/rejected`,
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
        throw new Error("Medical event ID is required");
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}/approve`,
        });
        return true;
    } catch (err) {
        console.error(`Failed to approve medical event: ${err}`);
        throw new Error("Unable to approve medical event. Please try again.");
    }
}

export async function FecthRejectMedicalEvent(id: string): Promise<boolean> {
    if (!id) {
        throw new Error("Medical event ID is required");
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}/reject`,
        });
        return true;
    } catch (err) {
        console.error(`Failed to reject medical event: ${err}`);
        throw new Error("Unable to opt out of medical event. Please try again.");
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
        throw new Error("Medical event ID is required");
    }
    try {
        await ApiClient<string>({
            method: 'DELETE',
            endpoint: `/medical-events/health-activities/${id}`
        });
        return true;
    } catch (err) {
        console.error("Failed to delete medical event:", err);
        throw new Error("Unable to delete medical event. Please try again.");
    }
}