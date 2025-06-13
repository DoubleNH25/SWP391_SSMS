import { Student } from "./Student";
import { UserUpdate } from "./User";

export interface ActivityMedicalEventViewModel {
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

export interface ActivityMedicalEventDetailViewModel {
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
    student: Student | null;
    responsibleUser: UserUpdate | null;
}


