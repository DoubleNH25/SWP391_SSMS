import { Users, ListTodo, Activity, Pill } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchDashboardStats } from "@/services/DashboardService";
import { FetchAllIncidentsWithoutStudentId } from "@/services/IncidentService";
import { FecthMedicalRequest } from "@/services/MedicalRequest";
import { FecthHealthProfile } from "@/services/HealthProfileService";
import { FecthVaccinationCampaign } from "@/services/VaccinationCampaignService";
import { Student } from "@/types/HealthProfile";
import { ListMedicalRequestViewModel } from "@/types/MedicalRequest";
import { VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import { Incident } from "@/types/Incident";

export default function NurseDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    incidents: 0,
    processingPrescriptions: 0,
    totalParents: 0,
  });
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [medicalRequests, setMedicalRequests] = useState<
    ListMedicalRequestViewModel[]
  >([]);
  const [healthProfiles, setHealthProfiles] = useState<Student[]>([]);
  const [campaigns, setCampaigns] = useState<VaccinationCampaignsViewModel[]>(
    []
  );

  useEffect(() => {
    const fetchStats = async () => {
      const data = await FetchDashboardStats();
      setStats({
        totalStudents: data.totalStudents,
        incidents: data.incidents,
        processingPrescriptions: data.processingPrescriptions,
        totalParents: data.totalParents,
      });
    };
    fetchStats();
    FetchAllIncidentsWithoutStudentId().then(setIncidents);
    FecthMedicalRequest().then(setMedicalRequests);
    FecthHealthProfile().then(setHealthProfiles);
    FecthVaccinationCampaign().then(setCampaigns);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">
        Bảng điều khiển y tá
      </h1>

      {/* --- KPI Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng số học sinh"
          value={stats.totalStudents}
          icon={<Users className="w-8 h-8 text-blue-600" />}
        />
        <StatCard
          title="Sự cố y tế"
          value={stats.incidents}
          icon={<Activity className="w-8 h-8 text-red-600" />}
        />
        <StatCard
          title="Đơn thuốc đang xử lý"
          value={stats.processingPrescriptions}
          icon={<Pill className="w-8 h-8 text-emerald-600" />}
        />
        <StatCard
          title="Tổng số phụ huynh"
          value={stats.totalParents}
          icon={<ListTodo className="w-8 h-8 text-green-600" />}
        />
      </div>

      {/* --- Tables Group --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Sự cố y tế cần xử lý */}
        <Section title="Sự cố y tế cần xử lý">
          <Table
            headers={[
              "Học sinh",
              "Lớp",
              "Loại sự cố",
              "Thời gian",
              "Trạng thái",
            ]}
            rows={incidents.map((i) => [
              i.studentId || "-",
              "-",
              i.type || "-",
              i.incidentDate ? new Date(i.incidentDate).toLocaleString() : "-",
              <span
                className={`
                inline-block px-2 py-1 rounded-full text-xs font-semibold
                ${
                  i.status === "Resolved"
                    ? "bg-green-100 text-green-800"
                    : i.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }
              `}
              >
                {i.status === "Resolved"
                  ? "Đã xử lý"
                  : i.status === "Pending"
                  ? "Chờ xử lý"
                  : "Bất thường"}
              </span>,
            ])}
          />
        </Section>

        {/* Yêu cầu thuốc/y tế cần duyệt */}
        <Section title="Yêu cầu thuốc/y tế cần duyệt">
          <Table
            headers={[
              "Học sinh",
              "Lớp",
              "Loại thuốc",
              "Thời gian",
              "Trạng thái",
            ]}
            rows={medicalRequests.map((r) => [
              r.studentName || "-",
              r.studentClass || "-",
              r.medicationName || "-",
              r.createdTime ? new Date(r.createdTime).toLocaleString() : "-",
              <span
                className={`
                inline-block px-2 py-1 rounded-full text-xs font-semibold
                ${
                  r.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : r.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }
              `}
              >
                {r.status === "Approved"
                  ? "Đã duyệt"
                  : r.status === "Pending"
                  ? "Chờ duyệt"
                  : "Từ chối"}
              </span>,
            ])}
          />
        </Section>

        {/* Hồ sơ sức khỏe học sinh */}
        <Section title="Hồ sơ sức khỏe học sinh">
          <Table
            headers={["Học sinh", "Lớp", "Ngày sinh"]}
            rows={healthProfiles.map((h) => [
              h.fullName || "-",
              h.studentClass?.className || "-",
              h.dateOfBirth
                ? new Date(h.dateOfBirth).toLocaleDateString()
                : "-",
            ])}
          />
        </Section>

        {/* Lịch tiêm chủng/khám sức khỏe */}
        <Section title="Lịch tiêm chủng/khám sức khỏe">
          <Table
            headers={["Tên chiến dịch", "Số lượng lớp tham gia"]}
            rows={campaigns.map((c) => [
              c.name || "-",
              Array.isArray(c.classIds) ? c.classIds.length.toString() : "-",
            ])}
          />
        </Section>
      </div>
    </div>
  );
}

/* ----- Helpers ----- */

// Section wrapper with title
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
}

// Generic table component
function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-8 text-center text-gray-400"
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr
                key={i}
                className={
                  `transition-colors duration-150 ` +
                  (i % 2 === 0 ? "bg-white" : "bg-gray-50") +
                  " hover:bg-blue-50 hover:shadow"
                }
              >
                {r.map((cell, j) => (
                  <td
                    key={j}
                    className="px-4 py-3 text-gray-800 whitespace-nowrap max-w-xs overflow-x-auto rounded-lg"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// KPI card with subtle gradient + hover shadow
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 flex items-center justify-between group cursor-pointer">
      <div>
        <div className="text-gray-500 text-xs uppercase tracking-wide mb-1 group-hover:text-blue-700 transition">
          {title}
        </div>
        <div className="text-3xl font-bold text-gray-800 group-hover:text-blue-700 transition">
          {value}
        </div>
      </div>
      <div className="text-4xl opacity-80 group-hover:scale-110 group-hover:text-blue-500 transition-transform">
        {icon}
      </div>
    </div>
  );
}
