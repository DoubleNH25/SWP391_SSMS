import { IncidentCreateViewModel, Incident } from "@/types/Incident";
import ApiClient from "@/utils/ApiBase";

export async function FecthCreateIncident(
  data: IncidentCreateViewModel
): Promise<boolean> {
  if (!localStorage.getItem("token")) {
    throw new Error("User is not authenticated");
  }
  if (
    !data.studentId ||
    !data.type ||
    !data.description ||
    !data.incidentDate
  ) {
    throw new Error("All fields are required");
  }
  try {
    await ApiClient<boolean>({
      method: "POST",
      endpoint: "/medical/incident",
      data: data,
    });
    return true;
  } catch (err) {
    console.error("Failed to create incident:", err);
    throw new Error("Failed to create incident. Please try again.");
  }
}

export async function FecthAllIncidents(
  studentId: string
): Promise<Incident[]> {
  try {
    const response = await ApiClient<Incident[]>({
      method: "GET",
      endpoint: `/medical/incident?studentId=${studentId}`,
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch incidents:", err);
    throw new Error("Failed to fetch incidents. Please try again.");
  }
}

export async function FetchAllIncidentsWithoutStudentId(): Promise<Incident[]> {
  try {
    const response = await ApiClient<Incident[]>({
      method: "GET",
      endpoint: `/medical/incident`,
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch all incidents:", err);
    throw new Error("Failed to fetch all incidents. Please try again.");
  }
}

export async function FecthDeleteIncident(id: string): Promise<boolean> {
  try {
    await ApiClient<void>({
      method: "DELETE",
      endpoint: `/medical/incident/${id}`,
    });
    return true;
  } catch (err) {
    console.error("Failed to delete incident:", err);
    throw new Error("Failed to delete incident. Please try again.");
  }
}

export async function FecthUpdateIncident(
  id: string,
  data: Partial<Incident>
): Promise<boolean> {
  try {
    await ApiClient<void>({
      method: "PUT",
      endpoint: `/medical/incident/${id}`,
      data,
    });
    return true;
  } catch (err) {
    console.error("Failed to update incident:", err);
    throw new Error("Failed to update incident. Please try again.");
  }
}

export async function FecthUpdateIncidentStatus(
  id: string,
  status: string
): Promise<boolean> {
  try {
    await ApiClient<void>({
      method: "PATCH",
      endpoint: `/medical/incident/status/${id}`,
      data: { status },
    });
    return true;
  } catch (err) {
    console.error("Failed to update incident status:", err);
    throw new Error("Failed to update incident status. Please try again.");
  }
}
