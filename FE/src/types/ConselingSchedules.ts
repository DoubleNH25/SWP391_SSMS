export interface ConselingSchedules {
    studentId: string;
    healthCheckupId: string;
    note: string;
    requestDate: string;
}

export interface ConselingSchedulesAND {
    id: string;
    studentId: string;
    studentName: string;
    parentName: string;
    healthCheckupId: string;
    meetingDate: Date;
    note: string;
    status: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string;
}

export interface ConselingSchedulesANDUpdate {
    conselingScheduleId: string;
    scheduledTime: string;
}