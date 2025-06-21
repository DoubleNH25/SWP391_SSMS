import { ActivityMedicalEventViewModel } from "@/types/ActivityMedicalEvent";
import { MedicalAccess } from "@/types/Medical";
import ApiClient from "@/utils/ApiBase";

export async function FecthActivityMedicalEvent(): Promise<ActivityMedicalEventViewModel[]> {
    try {
        const response = await ApiClient<ActivityMedicalEventViewModel[]>({
            method: 'GET',
            endpoint: '/parents/activity-consents/my-children',
        });
        return response?.data || [];
    } catch (err) {
        console.error('Failed to get activity medical events:', err);
        return [];
    }
}

export async function FecthConfirmActivityMedicalEvent(activityId: string, status: string): Promise<boolean> {
    if (!activityId) {
        throw new Error('Activity ID is required');
    }
    if (!localStorage.getItem('token')) {
        throw new Error('User is not authenticated');
    }
    try {
        await ApiClient<boolean>({
            method: 'PUT',
            endpoint: `/parents/activity-consents/${activityId}/confirm`,
            data: status
        });
        return true;
    } catch (err) {
        console.error('Failed to confirm activity medical events:', err);
        throw new Error('Unable to confirm activity medical events. Please try again.');
    }
}

export async function FecthRejectActivityMedicalEvent(activityId: string, status: string): Promise<boolean> {
    if (!activityId) {
        throw new Error('Activity ID is required');
    }
    if (!localStorage.getItem('token')) {
        throw new Error('User is not authenticated');
    }
    try {
        await ApiClient<boolean>({
            method: 'PUT',
            endpoint: `/parents/activity-consents/${activityId}/confirm`,
            data: status
        });
        return true;
    } catch (err) {
        console.error('Failed to reject activity medical events:', err);
        throw new Error('Unable to opt out of activity medical events. Please try again.');
    }
}

export async function UpdateActivityConsentStatus(consentId: string, status: 1 | 2): Promise<boolean> {
    if (!consentId) {
        throw new Error('Consent ID is required');
    }
    if (!localStorage.getItem('token')) {
        throw new Error('User is not authenticated');
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/parents/activity-consents/${consentId}/status`,
            data: status // 1 = Approved, 2 = Rejected
        });
        return true;
    } catch (err) {
        console.error('Failed to update consent status:', err);
        throw new Error('Unable to update consent status. Please try again.');
    }
}

export async function UpdateActivityConsentSchedules(data: MedicalAccess): Promise<boolean> {
    if (!data) {
        throw new Error('Consent Schedule ID is required');
    }
    if (!localStorage.getItem('token')) {
        throw new Error('User is not authenticated');
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/parents/conseling-schedules-status`,
            data: data
        });
        return true;
    } catch (err) {
        console.error('Failed to update consent status:', err);
        throw new Error('Unable to update consent status. Please try again.');
    }
}

