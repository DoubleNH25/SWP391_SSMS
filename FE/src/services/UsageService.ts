
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateUsage(data: UsageCreateViewModel): Promise<boolean> {
    if (!localStorage.getItem('token')) {
        throw new Error('User is not authenticated');
    }
    if (!data.medicalIncidentId || !data.medicalUsageDetails) {
        throw new Error('All fields are required');
    }
    try {
        await ApiClient<boolean>({
            method: 'POST',
            endpoint: '/medical/usage',
            data: data
        });
        return true
    } catch (err) {
        console.error('Failed to create usage:', err);
        throw new Error('Failed to create usage. Please try again.');
    }
}
