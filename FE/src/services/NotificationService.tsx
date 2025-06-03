import { NotificationViewModel } from "@/types/Notification";
import ApiClient from "@/utils/ApiBase";

export async function FecthNotification(): Promise<NotificationViewModel[]> {
  try {
    const response = await ApiClient<NotificationViewModel[]>({
      method: 'GET',
      endpoint: '/parents/activity-consents/my-children',
    });
    return response.data;
  } catch (err) {
    throw new Error(`Failed to get notification: ${err}`);
  }
}