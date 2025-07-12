import { Users, Clock, Stethoscope, Pill, Activity } from "lucide-react";
import { MedicalEventViewModel } from "@/types/MedicalEvent";
import BlogSlider from "./BlogSlider";

export default function ManagerDashboard({
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sự cố y tế</p>
              <p className="text-2xl font-bold">{stats.incidents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số học sinh</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số phụ huynh</p>
              <p className="text-2xl font-bold">{stats.totalParents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đơn thuốc đang xử lý</p>
              <p className="text-2xl font-bold">
                {stats.processingPrescriptions}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Pill className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đơn thuốc đang xử lý</p>
              <p className="text-2xl font-bold">
                {stats.processingPrescriptions}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Sự kiện y tế chờ duyệt</h2>
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
                {medicalEvents.map((event, index) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tin mới</h2>
          <BlogSlider />
        </div>
      </div>
    </>
  );
}
