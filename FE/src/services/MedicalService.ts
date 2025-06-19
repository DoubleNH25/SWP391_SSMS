import { MedicalCreateViewModel, MedicalUpdateViewModel, MedicalViewModel } from "@/types/Medical";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateMedical(medical: MedicalCreateViewModel): Promise<boolean> {
    if (!medical.name || !medical.quantity || !medical.expiryDate) {
        throw new Error("Please enter complete medical information");
    }
    try {
        await ApiClient<MedicalCreateViewModel>({
            method: 'POST',
            endpoint: '/medical/stock',
            data: medical,
        });
        return true;
    } catch (err) {
        console.error("Failed to create medical:", err);
        throw new Error("Unable to create medical. Please try again.");
    }
}

export async function FecthMedical(): Promise<MedicalViewModel[]> {
    try {
        const response = await ApiClient<MedicalViewModel[]>({
            method: 'GET',
            endpoint: '/medical/stock',
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get medical:", err);
        throw new Error("Unable to get medical. Please try again.");
    }
}

export async function FecthDeleteMedical(id: string): Promise<boolean> {
    if (!id) {
        throw new Error("Please enter complete medical information");
    }
    try {
        await ApiClient<string>({
            method: 'DELETE',
            endpoint: `/medical/stock/${id}`,
        });
        return true;
    } catch (err) {
        console.error("Failed to delete medical:", err);
        throw new Error("Unable to delete medical. Please try again.");
    }
}

export async function FecthUpdateMedical(id: string, medical: MedicalUpdateViewModel): Promise<boolean> {
    if (!id || !medical || !medical.name || !medical.quantity || !medical.expiryDate) {
        throw new Error("Please enter complete medical information");
    }
    try {
        console.log(medical);
        await ApiClient<MedicalUpdateViewModel>({
            method: 'PUT',
            endpoint: `/medical/stock/${id}`,
            data: medical,
        });
        return true;
    } catch (err) {
        console.error("Failed to update medical:", err);
        throw new Error("Unable to update medical. Please try again.");
    }
}

export async function FecthMedicalById(id: string): Promise<MedicalCreateViewModel> {
    if (!id) {
        throw new Error("Please enter complete medical information");
    }
    try {
        const response = await ApiClient<MedicalCreateViewModel>({
            method: 'GET',
            endpoint: `/medical/stock/${id}`,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get medical:", err);
        throw new Error("Unable to get medical. Please try again.");
    }
}
