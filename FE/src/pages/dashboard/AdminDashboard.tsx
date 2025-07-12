import { Users, Clock, Pill, Activity } from "lucide-react";
import { MedicalEventViewModel } from "@/types/MedicalEvent";
import BlogSlider from "./BlogSlider";

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
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          title="Đơn thuốc đang xử lý"
          value={stats.processingPrescriptions}
          icon={<Pill className="w-8 h-8 text-emerald-600" />}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sự kiện y tế chờ duyệt */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Sự kiện y tế chờ duyệt</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Sự kiện</th>
                  <th className="text-left py-3 px-4">Chi phí</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {medicalEvents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center px-4 py-2">
                      Không có sự kiện nào
                    </td>
                  </tr>
                ) : (
                  medicalEvents.map((event, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{event.name}</td>
                      <td className="py-3 px-4">-</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            event.status === "Approved"
                              ? "bg-blue-100 text-blue-800"
                              : event.status === "Pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {event.status === "Approved"
                            ? "ĐÃ DUYỆT"
                            : event.status === "Pending"
                            ? "CHỜ DUYỆT"
                            : "TỪ CHỐI"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Tin mới */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Tin mới</h2>
          <BlogSlider />
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
