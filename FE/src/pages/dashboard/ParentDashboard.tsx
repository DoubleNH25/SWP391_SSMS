import React, { useEffect, useState } from "react";
import ApiClient from "@/utils/ApiBase";
import { Student } from "@/types/HealthProfile";
import {
  MedicalHealthCheckupRecord,
  MedicalVaccinationRecord,
} from "@/types/MedicalRecord";
import { ConselingSchedulesAND } from "@/types/ConselingSchedules";

export default function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [healthCheckups, setHealthCheckups] = useState<
    MedicalHealthCheckupRecord[]
  >([]);
  const [vaccinations, setVaccinations] = useState<MedicalVaccinationRecord[]>(
    []
  );
  const [conselings, setConselings] = useState<ConselingSchedulesAND[]>([]);
  type ActivityConsent = {
    id?: string;
    activityName?: string;
    childName?: string;
    status?: string;
  };
  const [activityConsents, setActivityConsents] = useState<ActivityConsent[]>(
    []
  );

  useEffect(() => {
    ApiClient<Student[]>({
      method: "GET",
      endpoint: "/parents/students",
    }).then((res) => setStudents(res?.data || []));
    ApiClient<MedicalHealthCheckupRecord[]>({
      method: "GET",
      endpoint: "/parents/get-all-student-health-checkup",
    }).then((res) => setHealthCheckups(res?.data || []));
    ApiClient<MedicalVaccinationRecord[]>({
      method: "GET",
      endpoint: "/parents/get-all-vaccination-records",
    }).then((res) => setVaccinations(res?.data || []));
    ApiClient<ConselingSchedulesAND[]>({
      method: "GET",
      endpoint: "/parents/get-all-conseling-schedules",
    }).then((res) => setConselings(res?.data || []));
    ApiClient<ActivityConsent[]>({
      method: "GET",
      endpoint: "/parents/activity-consents/my-children",
    }).then((res) => setActivityConsents(res?.data || []));
  }, []);

  // Số sự kiện y tế sắp tới: healthCheckups có ngày >= hôm nay
  const today = new Date();
  const upcomingEvents = healthCheckups.filter((hc) => {
    const date = new Date(hc.recordDate || hc.time || "");
    return !isNaN(date.getTime()) && date >= today;
  });

  // Helper function để lấy tên hoạt động có ý nghĩa
  const getActivityName = (healthActivityId: string) => {
    // Có thể mở rộng logic này để map với tên thực từ API
    // Hiện tại trả về tên mặc định, có thể cải thiện bằng cách fetch tên từ API
    return healthActivityId ? "Khám sức khỏe định kỳ" : "Không xác định";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">
        Bảng điều khiển phụ huynh
      </h1>

      {/* --- KPI Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Số con" value={students.length} icon="👨‍👩‍👧‍👦" />
        <StatCard
          title="Sự kiện sắp tới"
          value={upcomingEvents.length}
          icon="📅"
        />
        <StatCard title="Tiêm chủng" value={vaccinations.length} icon="💉" />
        <StatCard title="Tư vấn" value={conselings.length} icon="💬" />
      </div>

      {/* --- Tables Group --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Danh sách con */}
        <Section title="Danh sách con">
          <Table
            headers={["Họ tên", "Lớp", "Ngày sinh"]}
            rows={students.map((s) => [
              s.fullName,
              s.studentClass?.className || "-",
              s.dateOfBirth
                ? new Date(s.dateOfBirth).toLocaleDateString()
                : "-",
            ])}
          />
        </Section>

        {/* Lịch khám sức khỏe */}
        <Section title="Lịch khám sức khỏe">
          <Table
            headers={["Tên sự kiện", "Ngày", "Trạng thái"]}
            rows={healthCheckups.map((h) => [
              getActivityName(h.healthActivityId || ""),
              h.recordDate ? new Date(h.recordDate).toLocaleDateString() : "-",
              <span
                className={`
                  inline-block px-2 py-1 rounded-full text-xs font-semibold
                  ${
                    h.checkingStatus === "Normal"
                      ? "bg-green-100 text-green-800"
                      : h.checkingStatus === "Abnormal"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
              >
                {h.checkingStatus === "Normal"
                  ? "Bình thường"
                  : h.checkingStatus === "Abnormal"
                  ? "Bất thường"
                  : "Không xác định"}
              </span>,
            ])}
          />
        </Section>

        {/* Tiêm chủng */}
        <Section title="Lịch sử tiêm chủng">
          <Table
            headers={["Tên vaccine", "Ngày tiêm", "Trạng thái"]}
            rows={vaccinations.map((v) => [
              v.vaccineName || "-",
              v.vaccinatedAt
                ? new Date(v.vaccinatedAt).toLocaleDateString()
                : "-",
              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Hoàn thành
              </span>,
            ])}
          />
        </Section>

        {/* Tư vấn */}
        <Section title="Lịch sử tư vấn">
          <Table
            headers={["Ngày", "Nội dung", "Trạng thái"]}
            rows={conselings.map((c) => [
              c.meetingDate
                ? new Date(c.meetingDate).toLocaleDateString()
                : "-",
              c.note || "-",
              <span
                className={`
                inline-block px-2 py-1 rounded-full text-xs font-semibold
                ${
                  c.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : c.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }
              `}
              >
                {c.status === "Approved"
                  ? "Đã duyệt"
                  : c.status === "Pending"
                  ? "Chờ duyệt"
                  : "Từ chối"}
              </span>,
            ])}
          />
        </Section>
      </div>

      {/* Activity Consents */}
      <div>
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Xác nhận hoạt động y tế cho con
        </h2>
        <Table
          headers={["Hoạt động", "Tên con", "Trạng thái"]}
          rows={activityConsents.map((a) => [
            a.activityName || "-",
            a.childName || "-",
            <span
              className={`
              inline-block px-2 py-1 rounded-full text-xs font-semibold
              ${
                a.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : a.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-600"
              }
            `}
            >
              {a.status === "Approved"
                ? "Đã xác nhận"
                : a.status === "Pending"
                ? "Chờ xác nhận"
                : a.status || "-"}
            </span>,
          ])}
        />
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
