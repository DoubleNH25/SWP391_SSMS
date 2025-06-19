import { IncidentCreateViewModel } from "@/types/Incident";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateIncident(data: IncidentCreateViewModel): Promise<boolean> {
    if (!localStorage.getItem('token')) {
        throw new Error('User is not authenticated');
    }
    if (!data.studentId || !data.type || !data.description || !data.incidentDate) {
        throw new Error('All fields are required');
    }
    try {
        await ApiClient<boolean>({
            method: 'POST',
            endpoint: '/medical/incident',
            data: data
        });
        return true
    } catch (err) {
        console.error('Failed to create incident:', err);
        throw new Error('Failed to create incident. Please try again.');
    }
}
