import { Users, ListTodo, Activity, Pill } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchDashboardStats } from "@/services/DashboardService";
import {
  FetchAllIncidentsWithoutStudentId,
  Incident,
} from "@/services/IncidentService";
import { FecthMedicalRequest } from "@/services/MedicalRequest";
import { FecthHealthProfile } from "@/services/HealthProfileService";
import { FecthVaccinationCampaign } from "@/services/VaccinationCampaignService";
import { Student } from "@/types/HealthProfile";
import { ListMedicalRequestViewModel } from "@/types/MedicalRequest";
import { VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* 4 bảng bên dưới dạng grid 2 cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sự cố y tế cần xử lý */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Sự cố y tế cần xử lý</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">
                    Học sinh
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">Lớp</th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Loại sự cố
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Thời gian
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Trạng thái
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center px-4 py-2">
                      Không có sự cố nào
                    </td>
                  </tr>
                ) : (
                  incidents.map((i, idx) => (
                    <tr key={i.id || idx} className="border-b">
                      <td className="text-left px-4 py-2">{i.studentId}</td>
                      <td className="text-left px-4 py-2">-</td>
                      <td className="text-left px-4 py-2">{i.type}</td>
                      <td className="text-left px-4 py-2">
                        {i.incidentDate
                          ? new Date(i.incidentDate).toLocaleString()
                          : "-"}
                      </td>
                      <td className="text-left px-4 py-2">{i.status}</td>
                      <td className="text-left px-4 py-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded">
                          Xử lý
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yêu cầu thuốc/y tế cần duyệt */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">
            Yêu cầu thuốc/y tế cần duyệt
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">
                    Học sinh
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">Lớp</th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Loại thuốc
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Thời gian
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Trạng thái
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {medicalRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center px-4 py-2">
                      Không có yêu cầu nào
                    </td>
                  </tr>
                ) : (
                  medicalRequests.map((r, idx) => (
                    <tr key={r.id || idx} className="border-b">
                      <td className="text-left px-4 py-2">
                        {r.studentName || "-"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {r.studentClass || "-"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {r.medicationName || "-"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {r.createdTime
                          ? new Date(r.createdTime).toLocaleString()
                          : "-"}
                      </td>
                      <td className="text-left px-4 py-2">{r.status}</td>
                      <td className="text-left px-4 py-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded">
                          Duyệt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hồ sơ sức khỏe học sinh */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">
            Hồ sơ sức khỏe học sinh
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">
                    Học sinh
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">Lớp</th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Ngày sinh
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {healthProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center px-4 py-2">
                      Không có hồ sơ nào
                    </td>
                  </tr>
                ) : (
                  healthProfiles.map((h, idx) => (
                    <tr key={h.id || idx} className="border-b">
                      <td className="text-left px-4 py-2">
                        {h.fullName || "-"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {h.studentClass?.className || "-"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {h.dateOfBirth
                          ? new Date(h.dateOfBirth).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="text-left px-4 py-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded">
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

        {/* Lịch tiêm chủng/khám sức khỏe */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">
            Lịch tiêm chủng/khám sức khỏe
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">
                    Tên chiến dịch
                  </th>
                  <th className="text-left px-4 py-2 font-semibold">
                    Số lượng lớp tham gia
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center px-4 py-2">
                      Không có chiến dịch nào
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c, idx) => (
                    <tr key={c.id || idx} className="border-b">
                      <td className="text-left px-4 py-2">{c.name}</td>
                      <td className="text-left px-4 py-2">
                        {Array.isArray(c.classIds) ? c.classIds.length : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}
