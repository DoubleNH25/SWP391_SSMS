import { VaccinationCampaignsUpdateCreateViewModel, VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateVaccinationCampaign(vaccinationCampaign: VaccinationCampaignsUpdateCreateViewModel): Promise<VaccinationCampaignsViewModel> {
    if (!vaccinationCampaign || typeof vaccinationCampaign !== 'object') {
        throw new Error('Vui lòng nhập đầy đủ thông tin chiến dịch tiêm chủng');
    }
    try {
        var response = await ApiClient<VaccinationCampaignsViewModel>({
            method: 'POST',
            endpoint: '/medical-events/vaccination-campaigns',
            data: vaccinationCampaign,
        });
        return response?.data || null;
    } catch (err: any) {
        console.error(`Failed to create vaccination campaign: ${err}`);
        throw new Error('Không thể tạo chiến dịch tiêm chủng. Vui lòng thử lại.');
    }
}

export async function FecthUpdateVaccinationCampaign(id: string, vaccinationCampaign: VaccinationCampaignsUpdateCreateViewModel): Promise<boolean> {
    if (!id) {
        throw new Error("ID chiến dịch tiêm chủng là bắt buộc");
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/vaccination-campaigns/${id}`,
            data: vaccinationCampaign,
        });
        return true;
    } catch (err: any) {
        console.error(`Failed to update vaccination campaign:`, err);
        throw new Error('Không thể cập nhật chiến dịch tiêm chủng. Vui lòng thử lại.');
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

export async function FecthRejectVaccinationCampaigns(): Promise<VaccinationCampaignsViewModel[]> {
    try {
        const response = await ApiClient<VaccinationCampaignsViewModel[]>({
            method: 'GET',
            endpoint: `/medical-events/vaccination-campaigns/reject`,
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
        throw new Error("ID chiến dịch tiêm chủng là bắt buộc");
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/vaccination-campaigns/${id}/approve`,
        });
        return true;
    } catch (err: any) {
        console.error(`Failed to approve vaccination campaign:`, err);
        throw new Error('Không thể phê duyệt chiến dịch tiêm chủng. Vui lòng thử lại.');
    }
}

export async function FecthRejectVaccinationCampaign(id: string): Promise<boolean> {
    if (!id) {
        throw new Error("ID chiến dịch tiêm chủng là bắt buộc");
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/vaccination-campaigns/${id}/reject`,
        });
        return true;
    } catch (err: any) {
        console.error(`Failed to reject vaccination campaign:`, err);
        throw new Error('Không thể từ chối chiến dịch tiêm chủng. Vui lòng thử lại.');
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
        throw new Error("ID chiến dịch tiêm chủng là bắt buộc");
    }
    try {
        await ApiClient<void>({
            method: 'DELETE',
            endpoint: `/medical-events/vaccination-campaigns/${id}`
        });
        return true;
    } catch (err: any) {
        console.error(`Failed to delete vaccination campaign:`, err);
        throw new Error('Không thể xóa chiến dịch tiêm chủng. Vui lòng thử lại.');
    }
}