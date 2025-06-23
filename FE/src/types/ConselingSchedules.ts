export interface ConselingSchedules {
    studentId: string;
    healthCheckupId: string;
    note: string;
    requestedDate: string;
}

export interface ConselingSchedulesAND {
    id: string;
    studentId: string;
    studentName: string;
    parentName: string;
    healthCheckupId: string;
    meetingDate: Date;
    note: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
    status: string;
}

export interface ConselingSchedulesANDUpdate {
    conselingScheduleId: string;
    scheduledTime: string;
}