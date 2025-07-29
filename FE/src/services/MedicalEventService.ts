import { MedicalEventParticipantViewModel, MedicalEventUpdateCreateViewModel, MedicalEventViewModel } from "@/types/MedicalEvent";
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

export async function FecthApproveRejectMedicalEvent(id: string, actions: string): Promise<boolean> {
    if (!id) {
        throw new Error("Medical event ID is required");
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}/approve-or-reject?action=${actions}`,
        });
        return true;
    } catch (err) {
        console.error(`Failed to approve medical event: ${err}`);
        throw new Error("Unable to approve medical event. Please try again.");
    }
}

export async function FecthApprovedRejectedMedicalEvents(): Promise<MedicalEventViewModel[]> {
    try {
        const response = await ApiClient<MedicalEventViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/health-activities/approve-reject`,
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


export async function FetchGetEventParticipant(type: string,): Promise<MedicalEventParticipantViewModel[]> {
    if (!type) {
        throw new Error("Type is required");
    }
    try {
        const response = await ApiClient<MedicalEventParticipantViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/activity-consents/vaccination-campaigns/activity-type?type=${type}`
        });
        if (!response.data) {
            return [];
        }
        return response?.data || [];
    } catch (err) {
        console.error("Failed to delete medical event:", err);
        throw new Error("Unable to delete medical event. Please try again.");
    }
}
