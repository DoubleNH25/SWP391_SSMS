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

export async function FecthDeleteMedicalRequest(id: string): Promise<boolean> {
    if (!id) throw new Error("Missing medical request id");
    try {
        await ApiClient({
            method: 'DELETE',
            endpoint: `/medical/request/${id}`,
        });
        return true;
    } catch (err) {
        console.error("Failed to delete medical request:", err);
        throw new Error("Unable to delete medical request. Please try again.");
    }
}

export async function FecthMedicalRequestByStudent(studentId: string): Promise<ListMedicalRequestViewModel[]> {
    try {
        const response = await ApiClient<ListMedicalRequestViewModel[]>({
            method: 'GET',
            endpoint: `/medical/request/student/${studentId}`,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get medical request by student:", err);
        throw new Error("Unable to get medical request by student. Please try again.");
    }
}

export async function FecthMedicalRequestByParent(parentId: string): Promise<ListMedicalRequestViewModel[]> {
    try {
        const response = await ApiClient<ListMedicalRequestViewModel[]>({
            method: 'GET',
            endpoint: `/medical/request/parent/${parentId}`,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get medical request by parent:", err);
        throw new Error("Unable to get medical request by parent. Please try again.");
    }
}

export async function FecthMedicalRequestByDate(date: string): Promise<ListMedicalRequestViewModel[]> {
    try {
        const response = await ApiClient<ListMedicalRequestViewModel[]>({
            method: 'GET',
            endpoint: `/medical/request/daily/${date}`,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get medical request by date:", err);
        throw new Error("Unable to get medical request by date. Please try again.");
    }
}

export async function FecthMedicalRequestToday(): Promise<ListMedicalRequestViewModel[]> {
    try {
        const response = await ApiClient<ListMedicalRequestViewModel[]>({
            method: 'GET',
            endpoint: `/medical/request/daily/today`,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get medical request today:", err);
        throw new Error("Unable to get medical request today. Please try again.");
    }
}

export async function FecthMedicalRequestSearch(params: Record<string, any>): Promise<ListMedicalRequestViewModel[]> {
    try {
        // Build query string
        const query = Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join("&");
        const endpoint = `/medical/request/search${query ? `?${query}` : ""}`;
        const response = await ApiClient<ListMedicalRequestViewModel[]>({
            method: 'GET',
            endpoint,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to search medical request:", err);
        throw new Error("Unable to search medical request. Please try again.");
    }
}

export async function FecthMedicalRequestHistoryCompletedByDate(date: string): Promise<ListMedicalRequestViewModel[]> {
    try {
        const response = await ApiClient<ListMedicalRequestViewModel[]>({
            method: 'GET',
            endpoint: `/medical/request/history/completed/${date}`,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get completed medical request by date:", err);
        throw new Error("Unable to get completed medical request by date. Please try again.");
    }
}

export async function FecthMedicalRequestHistoryCompletedToday(): Promise<ListMedicalRequestViewModel[]> {
    try {
        const response = await ApiClient<ListMedicalRequestViewModel[]>({
            method: 'GET',
            endpoint: `/medical/request/history/completed/today`,
        });
        return response.data;
    } catch (err) {
        console.error("Failed to get completed medical request today:", err);
        throw new Error("Unable to get completed medical request today. Please try again.");
    }
}

export async function FecthCreateMedicalAdministration(data: any): Promise<boolean> {
    try {
        await ApiClient({
            method: 'POST',
            endpoint: '/medical/request/administration',
            data,
        });
        return true;
    } catch (err) {
        console.error("Failed to create medical administration:", err);
        throw new Error("Unable to create medical administration. Please try again.");
    }
}