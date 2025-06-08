export interface NotificationViewModel {
    id: string;
    studentId: string;
    studentName: string;
    activityType: string;
    activityId: string;
    activityName: string;
    status:  "Pending" | "Approved" | "Rejected";
    scheduleTime: string;
    responsibleUserId: string;
    responsibleUserName: string;
}