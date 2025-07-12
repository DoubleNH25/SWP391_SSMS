import { NotificationViewModel } from "@/types/Notification";
import ApiClient from "@/utils/ApiBase";

export async function FecthNotification(): Promise<NotificationViewModel[]> {
  try {
    const response = await ApiClient<NotificationViewModel[]>({
      method: 'GET',
      endpoint: '/notifications',
    });
    return response?.data || [];
  } catch (err) {
    console.error('Failed to get notifications:', err);
    return [];
  }
}


export async function FecthReadNotification(id: string): Promise<boolean> {
  if (!id) {
    throw new Error('Notification ID is required');
  }
  if (!localStorage.getItem('token')) {
    throw new Error('User is not authenticated');
  }
  try {
    await ApiClient<boolean>({
      method: 'PUT',
      endpoint: `/notifications/${id}/read`,
    });
    return true;
  } catch (err) {
    console.error('Failed to read notification:', err);
    throw new Error('Unable to read notification. Please try again.');
  }
}

export async function FecthReadAllNotification(): Promise<boolean> {
  if (!localStorage.getItem('token')) {
    throw new Error('User is not authenticated');
  }
  try {
    await ApiClient<boolean>({
      method: 'PUT',
      endpoint: `/notifications/mark-all-read`,
    });
    return true;
  } catch (err) {
    console.error('Failed to read all notifications:', err);
    throw new Error('Unable to read all notifications. Please try again.');
  }
}


export async function FecthDeleteNotification(): Promise<boolean> {
  if (!localStorage.getItem('token')) {
    throw new Error('User is not authenticated');
  }
  try {
    await ApiClient<boolean>({
      method: 'DELETE',
      endpoint: `/notifications/delete-read`,
    });
    return true;
  } catch (err) {
    console.error('Failed to read all notifications:', err);
    throw new Error('Unable to read all notifications. Please try again.');
  }
}