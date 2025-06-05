import { NotificationViewModel } from "@/types/Notification";
import ApiClient from "@/utils/ApiBase";

export async function FecthNotification(): Promise<NotificationViewModel[]> {
  try {
    const response = await ApiClient<NotificationViewModel[]>({
      method: 'GET',
      endpoint: '/parents/activity-consents/my-children',
    });
    return response?.data || [];
  } catch (err) {
    console.error('Failed to get notifications:', err);
    return [];
  }
}

export async function FecthConfirmNotification(activityId: string): Promise<boolean> {
  if (!activityId) {
    console.error('Failed to found notifications:');
    return false;
  }
  else if (!localStorage.getItem('token')) {
    console.error('User is not authenticated');
    return false;
  }
  try {
    await ApiClient<boolean>({
      method: 'PUT',
      endpoint: `/parents/activity-consents/${activityId}/confirm`,
    });
    return true;
  } catch (err) {
    console.error('Failed to comfirm notifications:', err);
    return false;
  }
}