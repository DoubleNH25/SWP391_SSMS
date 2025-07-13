import { Users, Clock, Pill, Activity } from "lucide-react";
import { MedicalEventViewModel } from "@/types/MedicalEvent";
import BlogSlider from "./BlogSlider";
import { useEffect, useState } from "react";
import { FetchAllIncidentsWithoutStudentId } from "@/services/IncidentService";
import { FecthConselingSchedules } from "@/services/MedicalRecordService";
import { FecthTodayMedicalRequestCount } from "@/services/MedicalRequest";
import { Incident } from "@/types/Incident";
import { ConselingSchedulesAND } from "@/types/ConselingSchedules";

export default function AdminDashboard({
  stats,
  medicalEvents,
}: {
  stats: {
    totalStudents: number;
    incidents: number;
    processingPrescriptions: number;
    totalParents: number;
  };
  medicalEvents: MedicalEventViewModel[];
}) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [counselingSchedules, setCounselingSchedules] = useState<
    ConselingSchedulesAND[]
  >([]);
  const [todayRequestCount, setTodayRequestCount] = useState(0);

  useEffect(() => {
    // Fetch medical incidents
    const fetchIncidents = async () => {
      try {
        const data = await FetchAllIncidentsWithoutStudentId();
        setIncidents(data || []);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
        setIncidents([]);
      }
    };

    // Fetch counseling schedules
    const fetchCounselingSchedules = async () => {
      try {
        const data = await FecthConselingSchedules();
        setCounselingSchedules(data || []);
      } catch (error) {
        console.error("Failed to fetch counseling schedules:", error);
        setCounselingSchedules([]);
      }
    };

    // Fetch today's medical request count
    const fetchTodayRequestCount = async () => {
      const count = await FecthTodayMedicalRequestCount();
      setTodayRequestCount(count);
    };

    fetchIncidents();
    fetchCounselingSchedules();
    fetchTodayRequestCount();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">
        Bảng điều khiển quản trị
      </h1>

      {/* --- KPI Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Sự cố y tế"
          value={stats.incidents}
          icon={<Activity className="w-8 h-8 text-emerald-600" />}
        />
        <StatCard
          title="Tổng số học sinh"
          value={stats.totalStudents}
          icon={<Users className="w-8 h-8 text-blue-600" />}
        />
        <StatCard
          title="Tổng số phụ huynh"
          value={stats.totalParents}
          icon={<Clock className="w-8 h-8 text-yellow-600" />}
        />
        <StatCard
          title="ĐƠN THUỐC ĐANG XỬ LÝ"
          value={todayRequestCount}
          icon={<Pill className="w-8 h-8 text-emerald-600" />}
        />
      </div>

      {/* --- Tables Group --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Sự kiện y tế chờ duyệt */}
        <Section title="Sự kiện y tế chờ duyệt">
          <Table
            headers={["Sự kiện", "Chi phí", "Trạng thái"]}
            rows={medicalEvents.map((event) => [
              event.name || "-",
              "-",
              event.status === "Approved"
                ? "Đã duyệt"
                : event.status === "Pending"
                ? "Chờ duyệt"
                : event.status === "Rejected"
                ? "Từ chối"
                : event.status || "Không xác định",
            ])}
          />
        </Section>

        {/* Sự cố y tế */}
        <Section title="Sự cố y tế">
          <Table
            headers={["Học sinh", "Loại sự cố", "Thời gian", "Trạng thái"]}
            rows={incidents.map((incident) => [
              incident.studentId || "-",
              incident.type || "-",
              incident.incidentDate
                ? new Date(incident.incidentDate).toLocaleString()
                : "-",
              incident.status === "Approved"
                ? "Đã duyệt"
                : incident.status === "Pending"
                ? "Chờ duyệt"
                : incident.status === "Rejected"
                ? "Từ chối"
                : incident.status || "Không xác định",
            ])}
          />
        </Section>

        {/* Lịch tư vấn */}
        <Section title="Lịch tư vấn">
          <Table
            headers={["Học sinh", "Ngày tư vấn", "Nội dung", "Trạng thái"]}
            rows={counselingSchedules.map((schedule) => [
              schedule.studentName || "-",
              schedule.meetingDate
                ? new Date(schedule.meetingDate).toLocaleDateString()
                : "-",
              schedule.note || "-",
              schedule.status === "Approved"
                ? "Đã duyệt"
                : schedule.status === "Pending"
                ? "Chờ duyệt"
                : schedule.status === "Rejected"
                ? "Từ chối"
                : schedule.status || "Không xác định",
            ])}
          />
        </Section>

        {/* Tin mới */}
        <Section title="Tin mới">
          <BlogSlider />
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
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
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
