import { ConselingSchedulesAND, ConselingSchedulesANDUpdate } from "@/types/ConselingSchedules";
import { HealthCheckupRecord, MedicalHealthCheckupRecord, MedicalVaccinationRecord, VaccinationRecord } from "@/types/MedicalRecord";
import ApiClient from "@/utils/ApiBase";
import { data } from "react-router-dom";

export async function FecthMedicalVaccinationRecord(id: string,date: string): Promise<MedicalVaccinationRecord[]> {
  if (!localStorage.getItem('token')) {
    console.error('User is not authenticated');
    return [];
  }
  try {
    const response = await ApiClient<MedicalVaccinationRecord[]>({
      method: 'GET',
      endpoint: `/nurse/vaccination-records/by-date-and-campaignId?id=${id}&date=${date}`,
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get health profile: ${err}`);
    return [];
  }
}


export async function FecthUpdateVaccinationRecord(id: string, record: VaccinationRecord): Promise<boolean> {
  if (!id || !record) {
    throw new Error("ID and record data are required");
  }
  try {
    await ApiClient<VaccinationRecord>({
      method: 'PUT',
      endpoint: `/nurse/vaccination-records/${id}`,
      data: record,
    });
    return true;
  } catch (err) {
    console.error(`Failed to update medical event: ${err}`);
    throw new Error("Unable to update medical event. Please try again.");
  }
}

export async function FecthMedicalHealthCheckupRecord(id: string,date: string): Promise<MedicalHealthCheckupRecord[]> {
  if (!localStorage.getItem('token')) {
    console.error('User is not authenticated');
    return [];
  }
  try {
    const response = await ApiClient<MedicalHealthCheckupRecord[]>({
      method: 'GET',
      endpoint: `nurse/health-checkup-records/by-date-and-activityId?id=${id}&date=${date}`,
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get health profile: ${err}`);
    return [];
  }
}


export async function FecthMedicalHealthCheckupRecordAbnormal(): Promise<MedicalHealthCheckupRecord[]> {
  if (!localStorage.getItem('token')) {
    console.error('User is not authenticated');
    return [];
  }
  try {
    const response = await ApiClient<MedicalHealthCheckupRecord[]>({
      method: 'GET',
      endpoint: `nurse/health-checkup-records/abnormal`,
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get health profile: ${err}`);
    return [];
  }
}

export async function FecthUpdateHealthCheckupRecord(id: string, record: HealthCheckupRecord): Promise<boolean> {
  if (!id || !record) {
    throw new Error("ID and record data are required");
  }
  try {
    await ApiClient<HealthCheckupRecord>({
      method: 'PUT',
      endpoint: `/nurse/health-checkup-records/${id}`,
      data: record,
    });
    return true;
  } catch (err) {
    console.error(`Failed to update medical event: ${err}`);
    throw new Error("Unable to update medical event. Please try again.");
  }
}

export async function FecthConselingSchedules(): Promise<ConselingSchedulesAND[]> {
  if (!localStorage.getItem('token')) {
    console.error('User is not authenticated');
    return [];
  }
  try {
    const response = await ApiClient<ConselingSchedulesAND[]>({
      method: 'GET',
      endpoint: '/nurse/get-all-conseling-schedules',
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get conseling schedules: ${err}`);
    return [];
  }
}


export async function FecthConselingSchedulesByParent(): Promise<ConselingSchedulesAND[]> {
  if (!localStorage.getItem('token')) {
    console.error('User is not authenticated');
    return [];
  }
  try {
    const response = await ApiClient<ConselingSchedulesAND[]>({
      method: 'GET',
      endpoint: '/parents/get-all-conseling-schedules',
    });
    return response?.data || [];
  } catch (err) {
    console.error(`Failed to get conseling schedules: ${err}`);
    return [];
  }
}

export async function FecthUpdateConselingSchedules(data: ConselingSchedulesANDUpdate): Promise<boolean> {
  if (!data) {
    throw new Error("Data are required");
  }
  try {
    await ApiClient<ConselingSchedulesANDUpdate>({
      method: 'PUT',
      endpoint: `/nurse/accept-conseling-schedules`,
      data: data,
    });
    return true;
  } catch (err) {
    console.error(`Failed to update conseling schedules: ${err}`);
    throw new Error("Unable to update conseling schedules. Please try again.");
  }
}