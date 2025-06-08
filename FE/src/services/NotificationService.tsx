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

export async function FecthConfirmNotification(activityId: string, status: string): Promise<boolean> {
  if (!activityId) {
    throw new Error('Activity ID is required');
  }
  if (!localStorage.getItem('token')) {
    throw new Error('User is not authenticated');
  }
  try {
    await ApiClient<boolean>({
      method: 'PUT',
      endpoint: `/parents/activity-consents/${activityId}/confirm`,
      data: status
    });
    return true;
  } catch (err: any) {
    console.error('Failed to confirm notifications:', err);
    throw new Error('Không thể xác nhận thông báo. Vui lòng thử lại.');
  }
}

export async function FecthRejectNotification(activityId: string, status: string): Promise<boolean> {
  if (!activityId) {
    throw new Error('Activity ID is required');
  }
  if (!localStorage.getItem('token')) {
    throw new Error('User is not authenticated');
  }
  try {
    await ApiClient<boolean>({
      method: 'PUT',
      endpoint: `/parents/activity-consents/${activityId}/confirm`,
      data: status
    });
    return true;
  } catch (err: any) {
    console.error('Failed to reject notifications:', err);
    throw new Error('Không thể từ chối thông báo. Vui lòng thử lại.');
  }
}