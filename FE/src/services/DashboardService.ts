import ApiClient from "@/utils/ApiBase";

export interface DashboardStats {
  totalStudents: number;
  totalUsers: number;
  totalNurses: number;
  pendingEvents: number;
  processingPrescriptions: number;
  testEvents: number;
}

export async function FetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      studentsResponse,
      usersResponse,
      nursesResponse,
      pendingEventsResponse,
      prescriptionsResponse,
      testEventsResponse,
    ] = await Promise.all([
      ApiClient<{ total: number }>({
        method: "GET",
        endpoint: "/students/count",
      }),
      ApiClient<{ total: number }>({
        method: "GET",
        endpoint: "/users/count",
      }),
      ApiClient<{ total: number }>({
        method: "GET",
        endpoint: "/users/nurses/count",
      }),
      ApiClient<{ total: number }>({
        method: "GET",
        endpoint: "/medical-events/health-activities/pending/count",
      }),
      ApiClient<{ total: number }>({
        method: "GET",
        endpoint: "/medical/request/daily/today/count",
      }),
      ApiClient<{ total: number }>({
        method: "GET",
        endpoint: "/medical-events/health-activities/test/count",
      }),
    ]);

    return {
      totalStudents: studentsResponse.data.total,
      totalUsers: usersResponse.data.total,
      totalNurses: nursesResponse.data.total,
      pendingEvents: pendingEventsResponse.data.total,
      processingPrescriptions: prescriptionsResponse.data.total,
      testEvents: testEventsResponse.data.total,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    // Return default values if API calls fail
    return {
      totalStudents: 0,
      totalUsers: 0,
      totalNurses: 0,
      pendingEvents: 0,
      processingPrescriptions: 0,
      testEvents: 0,
    };
  }
}
