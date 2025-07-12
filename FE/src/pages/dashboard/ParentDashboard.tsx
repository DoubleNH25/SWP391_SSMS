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
  const [activityConsents, setActivityConsents] = useState<any[]>([]);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showModal, setShowModal] = useState(false);

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
    ApiClient<any[]>({
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

  // Modal hiển thị chi tiết (placeholder)
  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển phụ huynh</h1>
      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Số con" value={students.length} icon="👨‍👩‍👧‍👦" />
        <StatCard
          title="Sự kiện y tế sắp tới"
          value={upcomingEvents.length}
          icon="📅"
        />
        <StatCard
          title="Lịch sử tiêm chủng"
          value={vaccinations.length}
          icon="💉"
        />
        <StatCard title="Lịch sử tư vấn" value={conselings.length} icon="💬" />
      </div>
      {/* 4 bảng dạng grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Danh sách con */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Danh sách con</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Họ tên</th>
                <th className="text-left px-4 py-2 font-semibold">Lớp</th>
                <th className="text-left px-4 py-2 font-semibold">Ngày sinh</th>
                <th className="text-left px-4 py-2 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-4 py-2">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                students.map((s, idx) => (
                  <tr key={s.id || idx} className="border-b">
                    <td className="text-left px-4 py-2">{s.fullName}</td>
                    <td className="text-left px-4 py-2">
                      {s.studentClass?.className || "-"}
                    </td>
                    <td className="text-left px-4 py-2">
                      {s.dateOfBirth
                        ? new Date(s.dateOfBirth).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-left px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() =>
                          openModal(
                            <div>Chi tiết hồ sơ sức khỏe cho {s.fullName}</div>
                          )
                        }
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Lịch khám sức khỏe */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Lịch khám sức khỏe</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 font-semibold">
                  Tên sự kiện
                </th>
                <th className="text-left px-4 py-2 font-semibold">Ngày</th>
                <th className="text-left px-4 py-2 font-semibold">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-2 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {healthCheckups.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-4 py-2">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                healthCheckups.map((h, idx) => (
                  <tr key={h.healthActivityId || idx} className="border-b">
                    <td className="text-left px-4 py-2">
                      {h.healthActivityId || "-"}
                    </td>
                    <td className="text-left px-4 py-2">
                      {h.recordDate
                        ? new Date(h.recordDate).toLocaleDateString()
                        : h.time
                        ? new Date(h.time).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-left px-4 py-2">
                      {h.checkingStatus || "-"}
                    </td>
                    <td className="text-left px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() =>
                          openModal(<div>Chi tiết khám sức khỏe</div>)
                        }
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Lịch sử tiêm chủng */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Lịch sử tiêm chủng</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 font-semibold">
                  Tên vaccine
                </th>
                <th className="text-left px-4 py-2 font-semibold">Ngày tiêm</th>
                <th className="text-left px-4 py-2 font-semibold">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-2 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {vaccinations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-4 py-2">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                vaccinations.map((v, idx) => (
                  <tr key={v.id || idx} className="border-b">
                    <td className="text-left px-4 py-2">
                      {v.vaccineName || "-"}
                    </td>
                    <td className="text-left px-4 py-2">
                      {v.vaccinationDate
                        ? new Date(v.vaccinationDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-left px-4 py-2">{v.status || "-"}</td>
                    <td className="text-left px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() =>
                          openModal(<div>Chi tiết tiêm chủng</div>)
                        }
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Lịch sử tư vấn */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Lịch sử tư vấn</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Ngày</th>
                <th className="text-left px-4 py-2 font-semibold">Nội dung</th>
                <th className="text-left px-4 py-2 font-semibold">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-2 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {conselings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-4 py-2">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                conselings.map((c, idx) => (
                  <tr key={c.id || idx} className="border-b">
                    <td className="text-left px-4 py-2">
                      {c.meetingDate
                        ? new Date(c.meetingDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-left px-4 py-2">{c.note || "-"}</td>
                    <td className="text-left px-4 py-2">{c.status || "-"}</td>
                    <td className="text-left px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => openModal(<div>Chi tiết tư vấn</div>)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Section xác nhận hoạt động y tế */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="font-semibold text-lg mb-4">
          Xác nhận hoạt động y tế cho con
        </h2>
        {activityConsents.length === 0 ? (
          <div className="text-center text-gray-500">
            Không có hoạt động nào cần xác nhận
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 font-semibold">
                  Tên hoạt động
                </th>
                <th className="text-left px-4 py-2 font-semibold">Tên con</th>
                <th className="text-left px-4 py-2 font-semibold">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-2 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {activityConsents.map((a, idx) => (
                <tr key={a.id || idx} className="border-b">
                  <td className="text-left px-4 py-2">
                    {a.activityName || "-"}
                  </td>
                  <td className="text-left px-4 py-2">{a.childName || "-"}</td>
                  <td className="text-left px-4 py-2">{a.status || "-"}</td>
                  <td className="text-left px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        openModal(<div>Chi tiết xác nhận hoạt động y tế</div>)
                      }
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal chi tiết */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 min-w-[300px] max-w-[90vw]">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={closeModal}
            >
              ✕
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
      <div>
        <div className="text-gray-500 text-sm mb-1">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}
