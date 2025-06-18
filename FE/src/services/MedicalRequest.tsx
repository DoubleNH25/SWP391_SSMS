import { MedicalRequestCreateUpdateViewModel, ListMedicalRequestViewModel, MedicalRequestViewModel } from "@/types/MedicalRequest";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateMedicalRequest(medical: MedicalRequestCreateUpdateViewModel): Promise<boolean> {
    if (!medical.studentId || !medical.parentId || !medical.medicalRequestItems) {
        throw new Error("Please enter complete medical information");
    }
    try {
        await ApiClient<MedicalRequestCreateUpdateViewModel>({
            method: 'POST',
            endpoint: '/medical/request',
            data: medical,
        });
        return true;
    } catch (err) {
        console.error("Failed to create medical request:", err);
        throw new Error("Unable to create medical request. Please try again.");
    }
}


export async function FecthMedicalRequest(): Promise<ListMedicalRequestViewModel[]> {
    try {
        const response = await ApiClient<ListMedicalRequestViewModel[]>({
            method: 'GET',
            endpoint: '/medical/request',
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get medical request:", err);
        throw new Error("Unable to get medical request. Please try again.");
    }
}

export async function FecthMedicalRequestById(id: string): Promise<MedicalRequestViewModel> {
    try {
        const response = await ApiClient<MedicalRequestViewModel>({
            method: 'GET',
            endpoint: `/medical/request/${id}`,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get medical request by id:", err);
        throw new Error("Unable to get medical request by id. Please try again.");
    }
}

export async function FecthUpdateMedicalRequest(id: string, medicalRequest: MedicalRequestCreateUpdateViewModel): Promise<boolean> {
    if (!id || !medicalRequest) {
        throw new Error("Please enter complete medical request information");
    }
    try {
        await ApiClient<MedicalRequestCreateUpdateViewModel>({
            method: 'PUT',
            endpoint: `/medical/request/${id}`,
            data: medicalRequest,
        });
        return true;
    } catch (err) {
        console.error("Failed to update medical request:", err);
        throw new Error("Unable to update medical request. Please try again.");
    }
}