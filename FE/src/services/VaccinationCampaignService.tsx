import { VaccinationCampaignsUpdateCreateViewModel, VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateVaccinationCampaign(vaccinationCampaign: VaccinationCampaignsUpdateCreateViewModel): Promise<VaccinationCampaignsViewModel> {
    try {
        var response = await ApiClient<VaccinationCampaignsViewModel>({
            method: 'POST',
            endpoint: '/medical-events/vaccination-campaigns',
            data: vaccinationCampaign,
        });
        return response.data;
    } catch (err) {
        throw new Error(`Failed to create vaccination campaign: ${err}`);
    }
}

export async function FecthUpdateVaccinationCampaign(id: string, vaccinationCampaign: VaccinationCampaignsUpdateCreateViewModel): Promise<void> {
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/vaccination-campaigns/${id}`,
            data: vaccinationCampaign,
        });
    } catch (err) {
        throw new Error(`Failed to update vaccination campaign: ${err}`);
    }
}

export async function FecthVaccinationCampaign(): Promise<VaccinationCampaignsViewModel[]> {
    try {
        const response = await ApiClient<VaccinationCampaignsViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/vaccination-campaigns/all`,
        });
        return response.data;
    } catch (err) {
        throw new Error(`Failed to get vaccination campaign: ${err}`);
    }
}

export async function FecthPendingVaccinationCampaign(): Promise<VaccinationCampaignsViewModel[]> {
    try {
        const response = await ApiClient<VaccinationCampaignsViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/vaccination-campaigns/pending`,
        });
        return response.data;
    } catch (err) {
        throw new Error(`Failed to pending vaccination campaign: ${err}`);
    }
}

export async function FecthApproveVaccinationCampaign(id: string): Promise<void> {
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/vaccination-campaigns/${id}/approve`,
        });
    } catch (err) {
        throw new Error(`Failed to approved vaccination campaign: ${err}`);
    }
}

export async function FecthApproveVaccinationCampaigns(): Promise<VaccinationCampaignsViewModel[]> {
    try {
        const response = await ApiClient<VaccinationCampaignsViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/vaccination-campaigns/approved`,
        });
        return response.data;
    } catch (err) {
        throw new Error(`Failed to get approve vaccination campaign: ${err}`);
    }
}


export async function FecthDeleteVaccinationCampaign(id: string,): Promise<void> {
  try {
    await ApiClient<void>({
      method: 'DELETE',
      endpoint: `/medical-events/vaccination-campaigns/${id}`
    });
  } catch (err) {
    throw new Error(`Failed to delete vaccination campaign: ${err}`);
  }
}