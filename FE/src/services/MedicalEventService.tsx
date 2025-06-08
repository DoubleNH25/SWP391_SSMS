import { MedicalEventUpdateCreateViewModel, MedicalEventViewModel } from "@/types/MedicalEvent";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateMedicalEvent(medicalEvent: MedicalEventUpdateCreateViewModel): Promise<MedicalEventViewModel> {
    if (!medicalEvent || !medicalEvent.scheduledDate || !medicalEvent.description) {
        throw new Error("Vui lòng nhập đầy đủ thông tin sự kiện y tế");
    }
    try {
        var response = await ApiClient<MedicalEventViewModel>({
            method: 'POST',
            endpoint: '/medical-events/health-activities',
            data: medicalEvent,
        });
        return response.data;
    } catch (err: any) {
        console.error("Failed to create medical event:", err);
        throw new Error("Không thể tạo sự kiện y tế. Vui lòng thử lại.");
    }
}

export async function FecthUpdateMedicalEvent(id: string, medicalEvent: MedicalEventUpdateCreateViewModel): Promise<boolean> {
    if (!id || !medicalEvent) {
        throw new Error("ID và dữ liệu sự kiện y tế là bắt buộc");
    }
    try {
        await ApiClient<MedicalEventUpdateCreateViewModel>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}`,
            data: medicalEvent,
        });
        return true;
    } catch (err: any) {
        console.error(`Failed to update medical event: ${err}`);
        throw new Error("Không thể cập nhật sự kiện y tế. Vui lòng thử lại.");
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
        throw new Error("ID sự kiện y tế là bắt buộc");
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}/approve`,
        });
        return true;
    } catch (err: any) {
        console.error(`Failed to approve medical event: ${err}`);
        throw new Error("Không thể phê duyệt sự kiện y tế. Vui lòng thử lại.");
    }
}

export async function FecthRejectMedicalEvent(id: string): Promise<boolean> {
    if (!id) {
        throw new Error("ID sự kiện y tế là bắt buộc");
    }
    try {
        await ApiClient<void>({
            method: 'PUT',
            endpoint: `/medical-events/health-activities/${id}/reject`,
        });
        return true;
    } catch (err: any) {
        console.error(`Failed to reject medical event: ${err}`);
        throw new Error("Không thể từ chối sự kiện y tế. Vui lòng thử lại.");
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
        throw new Error("ID sự kiện y tế là bắt buộc");
    }
    try {
        await ApiClient<string>({
            method: 'DELETE',
            endpoint: `/medical-events/health-activities/${id}`
        });
        return true;
    } catch (err: any) {
        console.error("Failed to delete medical event:", err);
        throw new Error("Không thể xóa sự kiện y tế. Vui lòng thử lại.");
    }
}