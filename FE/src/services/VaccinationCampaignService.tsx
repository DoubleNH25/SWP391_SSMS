import { VaccinationCampaignsUpdateCreateViewModel, VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateVaccinationCampaign(vaccinationCampaign: VaccinationCampaignsUpdateCreateViewModel): Promise<VaccinationCampaignsViewModel> {
    if (!vaccinationCampaign || typeof vaccinationCampaign !== 'object') {
        console.error('Invalid vaccination campaign data');
        return null;
    }
    try {
        var response = await ApiClient<VaccinationCampaignsViewModel>({
            method: 'POST',
            endpoint: '/medical-events/vaccination-campaigns',
            data: vaccinationCampaign,
        });
        return response?.data || null;
    } catch (err) {
        console.error(`Failed to create vaccination campaign: ${err}`);
        return null;
    }
}

export async function FecthUpdateVaccinationCampaign(id: string, vaccinationCampaign: VaccinationCampaignsUpdateCreateViewModel): Promise<boolean> {
    if (!id) {
        console.error("Invalid update request: missing id.");
        return false;
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/vaccination-campaigns/${id}`,
            data: vaccinationCampaign,
        });
        return true;
    } catch (err) {
        console.error(`Failed to update vaccination campaign:`, err);
        return false;
    }
}

export async function FecthVaccinationCampaign(): Promise<VaccinationCampaignsViewModel[]> {
    try {
        const response = await ApiClient<VaccinationCampaignsViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/vaccination-campaigns/all`,
        });
        return response?.data || [];
    } catch (err) {
        console.error(`Failed to get vaccination campaign:`, err);
        return [];
    }
}

export async function FecthPendingVaccinationCampaign(): Promise<VaccinationCampaignsViewModel[]> {
    try {
        const response = await ApiClient<VaccinationCampaignsViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/vaccination-campaigns/pending`,
        });
        return response?.data || [];
    } catch (err) {
        console.error(`Failed to get pending vaccination campaigns:`, err);
        return [];
    }
}

export async function FecthApproveVaccinationCampaign(id: string): Promise<boolean> {
    if (!id) {
        console.error("Invalid approve request: missing id.");
        return false;
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/vaccination-campaigns/${id}/approve`,
        });
        return true;
    } catch (err) {
        console.error(`Failed to approve vaccination campaign:`, err);
        return false;
    }
}

export async function FecthApproveVaccinationCampaigns(): Promise<VaccinationCampaignsViewModel[]> {
    try {
        const response = await ApiClient<VaccinationCampaignsViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/vaccination-campaigns/approved`,
        });
        return response?.data || [];
    } catch (err) {
        console.error(`Failed to get approved vaccination campaigns:`, err);
        return [];
    }
}


export async function FecthDeleteVaccinationCampaign(id: string,): Promise<boolean> {
    if (!id) {
        console.error("Invalid delete request: missing id.");
        return false;
    }
    try {
        await ApiClient<void>({
            method: 'DELETE',
            endpoint: `/medical-events/vaccination-campaigns/${id}`
        });
        return true;
    } catch (err) {
        console.error(`Failed to delete vaccination campaign:`, err);
    return false;
    }
}