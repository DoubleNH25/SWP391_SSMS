import ApiClient from "@/utils/ApiBase";

export interface DashboardStats {
  totalStudents: number;
  incidents: number;
  processingPrescriptions: number;
  totalParents: number;
}

export async function FetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      studentsResponse,
      incidentsResponse,
      prescriptionsResponse,
      parentsResponse,
    ] = await Promise.all([
      ApiClient<{ count: number }>({
        method: "GET",
        endpoint: "/students/count",
      }),
      ApiClient<{ count: number }>({
        method: "GET",
        endpoint: "/incidents/count",
      }),
      ApiClient<{ count: number }>({
        method: "GET",
        endpoint: "/medical/request/daily/today/count",
      }),
      ApiClient<{ count: number }>({
        method: "GET",
        endpoint: "/parents/count",
      }),
    ]);

    return {
      totalStudents: studentsResponse.data.count,
      incidents: incidentsResponse.data.count,
      processingPrescriptions: prescriptionsResponse.data.count,
      totalParents: parentsResponse.data.count,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    // Return default values if API calls fail
    return {
      totalStudents: 0,
      incidents: 0,
      processingPrescriptions: 0,
      totalParents: 0,
    };
  }
}
