import React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useParams } from "react-router-dom";
import {
  FecthAllIncidents,
  FetchAllIncidentsWithoutStudentId,
  FecthDeleteIncident,
  FecthUpdateIncident,
  FecthUpdateIncidentStatus,
  Incident,
} from "@/services/IncidentService";

// Map trạng thái số hoặc tiếng Anh sang chữ tiếng Việt
const mapStatus = (status: string | number): string => {
  if (typeof status === "number") {
    switch (status) {
      case 0:
        return "Đang đợi";
      case 1:
        return "Đã xử lý";
      case 2:
        return "Nguy cấp";
      case 3:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  }
  // Map status tiếng Anh
  switch (status) {
    case "Pending":
      return "Đang đợi";
    case "Approved":
      return "Đã xử lý";
    case "Urgent":
      return "Nguy cấp";
    case "Cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

const statusColor: Record<string, string> = {
  "Đang đợi": "bg-blue-100 text-blue-700",
  "Đã xử lý": "bg-green-100 text-green-700",
  "Nguy cấp": "bg-red-100 text-red-700",
  "Đã hủy": "bg-gray-100 text-gray-700",
  "Không xác định": "bg-gray-100 text-gray-700",
};

const statusIcon: Record<string, React.ReactNode> = {
  "Đang đợi": <Info className="w-4 h-4 mr-1 text-blue-500" />,
  "Đã xử lý": <CheckCircle className="w-4 h-4 mr-1 text-green-500" />,
  "Nguy cấp": <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />,
  "Đã hủy": <XCircle className="w-4 h-4 mr-1 text-gray-500" />,
  "Không xác định": <Info className="w-4 h-4 mr-1 text-gray-500" />,
};

const statusOptions = [
  { value: "Đang đợi", label: "Đang đợi" },
  { value: "Đã xử lý", label: "Đã xử lý" },
  { value: "Nguy cấp", label: "Nguy cấp" },
  { value: "Đã hủy", label: "Đã hủy" },
];

export default function ManagerMedicalIncident() {
  const { studentId } = useParams<{ studentId: string }>();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string>("");
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<Incident | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Lấy danh sách sự cố y tế từ API
  useEffect(() => {
    setLoading(true);
    setError("");
    const fetchIncidents = studentId
      ? FecthAllIncidents(studentId)
      : FetchAllIncidentsWithoutStudentId();
    fetchIncidents
      .then((data) => {
        console.log("[DEBUG] incidents from API:", data);
        setIncidents(data);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else setError("Lỗi tải dữ liệu");
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  // Xóa sự cố y tế
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sự cố này?")) return;
    setLoading(true);
    try {
      await FecthDeleteIncident(id);
      setIncidents((prev) => prev.filter((i) => i.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Lỗi xóa sự cố");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (incident: Incident) => {
    setEditData(incident);
    setEditModal(true);
  };

  const handleEditChange = (field: keyof Incident, value: string) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
  };

  const handleEditSave = async () => {
    if (!editData) return;
    setEditLoading(true);
    try {
      // Cập nhật trạng thái nếu có thay đổi
      const original = incidents.find((i) => i.id === editData.id);
      if (original && original.status !== editData.status) {
        await FecthUpdateIncidentStatus(editData.id, editData.status || "");
      }

      // Cập nhật thông tin khác
      await FecthUpdateIncident(editData.id, {
        type: editData.type,
        description: editData.description,
        note: editData.note,
        details: editData.details,
      });

      // Cập nhật state ngay lập tức để UI phản hồi
      setIncidents((prev) =>
        prev.map((incident) =>
          incident.id === editData.id
            ? {
                ...incident,
                type: editData.type,
                description: editData.description,
                note: editData.note,
                details: editData.details,
                status: editData.status,
              }
            : incident
        )
      );

      // Reload lại danh sách từ server để đảm bảo đồng bộ
      const fetchIncidents = studentId
        ? FecthAllIncidents(studentId)
        : FetchAllIncidentsWithoutStudentId();
      const data = await fetchIncidents;
      setIncidents(data);

      setEditModal(false);
      setEditData(null);
    } catch (err) {
      alert((err as Error).message || "Lỗi cập nhật sự cố");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Info className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold">
            {studentId
              ? "Quản lý sự cố y tế học sinh"
              : "Quản lý tất cả sự cố y tế"}
          </h1>
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <Card className="shadow-lg rounded-xl overflow-x-auto">
        <CardContent className="p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Thời gian
                </th>
                {!studentId && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Học sinh
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Loại sự cố
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Mô tả
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={studentId ? 5 : 6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : incidents.length === 0 ? (
                <tr>
                  <td
                    colSpan={studentId ? 5 : 6}
                    className="text-center py-8 text-gray-400"
                  >
                    Không có sự cố nào.
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => {
                  const mappedStatus = mapStatus(incident.status);
                  return (
                    <tr
                      key={incident.id}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {incident.incidentDate || incident.createdTime}
                      </td>
                      {!studentId && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {incident.studentId}
                        </td>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {incident.type}
                      </td>
                      <td
                        className="px-4 py-3 max-w-xs truncate"
                        title={
                          incident.description ||
                          incident.note ||
                          incident.details ||
                          "Không có mô tả"
                        }
                      >
                        {incident.description ||
                          incident.note ||
                          incident.details ||
                          "Không có mô tả"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            statusColor[mappedStatus] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {statusIcon[mappedStatus] || (
                            <Info className="w-4 h-4 mr-1 text-gray-500" />
                          )}
                          {mappedStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center flex gap-2 justify-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelected(incident);
                            setShowModal(true);
                          }}
                        >
                          <Eye className="w-5 h-5 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(incident)}
                        >
                          <Edit className="w-5 h-5 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(incident.id)}
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {/* Modal chi tiết */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6 max-w-md mx-auto">
          {selected && (
            <>
              <div className="flex items-center gap-3 mb-4">
                {statusIcon[mapStatus(selected.status)] || (
                  <Info className="w-4 h-4 mr-1 text-gray-500" />
                )}
                <h2 className="text-xl font-bold">Chi tiết sự cố y tế</h2>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Thời gian:</span>{" "}
                {selected.incidentDate || selected.createdTime}
              </div>
              {!studentId && (
                <div className="mb-2">
                  <span className="font-semibold">Học sinh:</span>{" "}
                  {selected.studentId}
                </div>
              )}
              <div className="mb-2">
                <span className="font-semibold">Loại sự cố:</span>{" "}
                {selected.type}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Mô tả:</span>{" "}
                {selected.description ||
                  selected.note ||
                  selected.details ||
                  "Không có mô tả"}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Trạng thái:</span>{" "}
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    statusColor[mapStatus(selected.status)] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {statusIcon[mapStatus(selected.status)] || (
                    <Info className="w-4 h-4 mr-1 text-gray-500" />
                  )}
                  {mapStatus(selected.status)}
                </span>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  onClick={() => handleEdit(selected)}
                >
                  Sửa
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white flex-1"
                  onClick={() => handleDelete(selected.id)}
                >
                  Xóa
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
      {/* Modal sửa sự cố */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        <div className="p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Sửa sự cố y tế</h2>
          {editData && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-semibold mb-1">Loại sự cố</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={editData.type || ""}
                  onChange={(e) => handleEditChange("type", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Mô tả/Chi tiết
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={editData.description || ""}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Trạng thái</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={mapStatus(editData.status)}
                  onChange={(e) => handleEditChange("status", e.target.value)}
                  required
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  disabled={editLoading}
                >
                  {editLoading ? "Đang lưu..." : "Lưu"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditModal(false)}
                >
                  Hủy
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
