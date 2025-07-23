export interface MedicalEventUpdateCreateViewModel{
    name : string;
    description: string;
    scheduledDate: string;
    classIds: [string]
}

export interface MedicalEventViewModel{
    id: string;
    userId: string;
    name : string;
    description: string;
    scheduledDate: Date;
    status: "Pending" | "Approved" | "Rejected";
    classIds: [string];
}

export interface MedicalEventParticipantViewModel{
    id: string;
    studentId: string;
    studentCode: string;
    studentName: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    classId: string;
    className: string;
    activityId: string;
    activityName: string;
    status: "Pending" | "Approved" | "Rejected";
    scheduleTime: string;
    responsibleUserId: string;
    responsibleUserName: string;
    description: string;
}


