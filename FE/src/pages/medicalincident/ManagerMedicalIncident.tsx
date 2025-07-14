import { AlertTriangleIcon, Users } from "lucide-react";
import Label from "@/components/ui/form/Label";
import PageHeader from "@/components/ui/PageHeader";
import {
  FecthParents,
  FecthStudents,
  FecthStudentsByParentId,
} from "@/services/UserService";
import { FecthCreateIncident } from "@/services/IncidentService";
import { showToast } from "@/components/ui/Toast";
import { Student } from "@/types/Student";
import { useState, useEffect, useCallback } from "react";
import SearchableSelect from "@/components/ui/form/SearchableSelect";
import {
  FetchIncidents,
  fetchIncidentDetail,
} from "@/services/IncidentService";
import { Incident } from "@/types/Incident";
import { Modal } from "@/components/ui/modal";
import { DecodeJWT } from "@/utils/DecodeJWT";
import ApiClient from "@/utils/ApiBase";
import { ParentViewModel } from "@/types/User";

// Định nghĩa type cho medicalUsages nếu chưa có

// Định nghĩa type cho object gửi backend (nếu chỉ cần 3 trường)
interface MedicalUsageCreate {
  medicalStockId: string;
  dosage: string;
  quantity: number;
}

export default function ManagerMedicalIncident() {
  const [searchTerm, setSearchTerm] = useState("");
  const [parents, setParents] = useState<ParentViewModel[]>([]);
  const [filteredParents, setFilteredParents] = useState<ParentViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentViewModel | null>(
    null
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [studentOptions, setStudentOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [studentsLoadingForSearch, setStudentsLoadingForSearch] =
    useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentsLoading, setIncidentsLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  // Xoá selectedIncident nếu không dùng

  // State cho modal tạo sự cố y tế
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    type: "",
    description: "",
    status: 0,
    incidentDate: "",
    incidentTime: "", // thêm trường này
  });
  const [requireMedicine, setRequireMedicine] = useState(false);
  // 1. Thay đổi state medicines để chứa đầy đủ trường
  const [medicines, setMedicines] = useState([
    {
      medicationName: "",
      form: "",
      dosage: "",
      route: "",
      frequency: 1,
      totalQuantity: 1,
      timeToAdminister: [""],
      startDate: "",
      endDate: "",
      notes: "",
    },
  ]);

  // Thêm state chứa danh sách thuốc
  const [medicineOptions, setMedicineOptions] = useState<
    { value: string; label: string; stock: number }[]
  >([]);

  // State cho modal chi tiết
  const [detailIncident, setDetailIncident] = useState<Incident | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Lấy role từ JWT
  const user = DecodeJWT() as {
    sub?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  } | null;
  const isParent =
    user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ===
    "Parent";
  const parentId = user?.sub || "";

  // Hàm fetch chi tiết
  const handleViewClick = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const data = await fetchIncidentDetail(id);
      setDetailIncident(data);
      setShowDetailModal(true);
    } catch {
      showToast.error("Không tải được chi tiết sự cố");
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // Fetch parents
  const fetchParent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await FecthParents();
      setParents(response || []);
      setFilteredParents(response || []);
    } catch {
      setParents([]);
      setFilteredParents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all students (luôn gọi khi load trang)
  const fetchAllStudents = useCallback(async () => {
    setStudentsLoadingForSearch(true);
    try {
      const response = await FecthStudents();
      const options = (response || []).map((student) => ({
        value: student.id,
        label: `${student.studentCode} - ${student.fullName} (${
          student.studentClass?.className || "N/A"
        })`,
      }));
      setStudentOptions(options);
    } catch {
      setStudentOptions([]);
    } finally {
      setStudentsLoadingForSearch(false);
    }
  }, []);

  // Thêm hàm fetchStudentsByParentId
  const fetchStudentsByParentId = useCallback(async (parentId: string) => {
    setStudentsLoadingForSearch(true);
    try {
      const response = await FecthStudentsByParentId(parentId);
      setStudents(response || []);
    } finally {
      setStudentsLoadingForSearch(false);
    }
  }, []);

  // Handle student select
  const handleStudentSelect = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
  }, []);

  // Fetch incidents
  const fetchIncidents = useCallback(async () => {
    setIncidentsLoading(true);
    try {
      const data = await FetchIncidents(selectedStudentId || undefined);
      setIncidents(data);
    } catch {
      setIncidents([]);
    } finally {
      setIncidentsLoading(false);
    }
  }, [selectedStudentId]);

  // Filter parents
  const filterParents = useCallback(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      setFilteredParents([]);
      return;
    }
    const filtered = parents.filter(
      (parent) =>
        parent.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.phone?.includes(searchTerm)
    );
    setFilteredParents(filtered);
  }, [parents, searchTerm]);

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStudentId("");
  };

  // Hàm fetch thuốc từ API
  const fetchMedicineStock = useCallback(async () => {
    try {
      const data = await ApiClient<
        {
          id: string;
          name: string;
          quantity: number;
        }[]
      >({
        method: "GET",
        endpoint: "/medical/stock",
      });
      setMedicineOptions(
        data.data.map((m) => ({
          value: m.id,
          label: `${m.name} (còn: ${m.quantity})`,
          stock: m.quantity,
        }))
      );
    } catch {
      showToast.error("Không tải được danh sách thuốc");
    }
  }, []);

  // Thêm logic tạo sự cố y tế
  const handleCreateIncident = async () => {
    if (
      !selectedStudentId ||
      !incidentForm.type ||
      !incidentForm.description ||
      !incidentForm.incidentDate ||
      !incidentForm.incidentTime // kiểm tra thêm trường này
    ) {
      showToast.warning("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }
    // Lọc và map thuốc hợp lệ
    const validMeds: MedicalUsageCreate[] = requireMedicine
      ? medicines
          .filter((m) => m.medicationName)
          .map((m) => ({
            medicalStockId: m.medicationName,
            dosage: m.dosage,
            quantity: m.totalQuantity,
          }))
      : [];
    try {
      await FecthCreateIncident({
        studentId: selectedStudentId,
        type: incidentForm.type,
        description: incidentForm.description,
        incidentDate: `${incidentForm.incidentDate}T${incidentForm.incidentTime}`,
        medicalUsageDetails: validMeds, // dùng type mới
      });
      setShowCreateModal(false);
      setIncidentForm({
        type: "",
        description: "",
        status: 0,
        incidentDate: "",
        incidentTime: "", // thêm trường này khi reset
      });
      setRequireMedicine(false);
      setMedicines([
        {
          medicationName: "",
          form: "",
          dosage: "",
          route: "",
          frequency: 1,
          totalQuantity: 1,
          timeToAdminister: [""],
          startDate: "",
          endDate: "",
          notes: "",
        },
      ]);
      fetchIncidents();
      showToast.success("Tạo sự cố y tế thành công!");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        showToast.error(
          (err as { message?: string }).message || "Tạo sự cố y tế thất bại!"
        );
      } else {
        showToast.error("Tạo sự cố y tế thất bại!");
      }
    }
  };

  // Effects
  useEffect(() => {
    fetchParent();
    fetchAllStudents();
    fetchIncidents();
  }, [fetchParent, fetchAllStudents, fetchIncidents]);

  useEffect(() => {
    filterParents();
  }, [filterParents]);

  useEffect(() => {
    fetchIncidents();
  }, [selectedStudentId, fetchIncidents]);

  // Nếu là parent, fetch danh sách con và chọn studentId đầu tiên
  useEffect(() => {
    if (isParent && parentId) {
      (async () => {
        const response = await FecthStudentsByParentId(parentId);
        setStudents(response || []);
        if (response && response.length > 0) {
          setSelectedStudentId(response[0].id);
        }
      })();
    }
  }, [isParent, parentId]);

  // Trigger fetch khi tích Yêu cầu thuốc
  useEffect(() => {
    if (requireMedicine && medicineOptions.length === 0) {
      fetchMedicineStock();
    }
  }, [requireMedicine, medicineOptions.length, fetchMedicineStock]);

  // UI
  return (
    <div className="p-6">
      <PageHeader
        title="Sự cố y tế"
        icon={<AlertTriangleIcon className="w-10 h-10" />}
        description="Quản lý sự cố y tế của học sinh"
      />
      {/* chỉ hiện filter khi NOT parent */}
      {!isParent && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Bộ lọc tìm kiếm
              </h2>
              {(searchTerm || selectedStudentId) && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label htmlFor="search">Tìm kiếm phụ huynh</Label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Tìm kiếm theo tên phụ huynh, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="student-search">Tìm kiếm học sinh</Label>
                <div className="flex flex-wrap gap-2 items-start">
                  <div className="flex-1 min-w-[200px]">
                    <SearchableSelect
                      options={studentOptions}
                      placeholder={
                        studentsLoadingForSearch
                          ? "Đang tải..."
                          : "Chọn học sinh theo mã hoặc tên..."
                      }
                      onChange={handleStudentSelect}
                      value={selectedStudentId}
                    />
                  </div>
                  <div className="flex flex-row gap-3 items-start">
                    <div className="flex flex-col gap-2 items-stretch">
                      <button
                        onClick={() => setShowCreateModal(true)}
                        disabled={
                          !selectedStudentId || studentsLoadingForSearch
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 h-[44px] text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                      >
                        <AlertTriangleIcon className="w-4 h-4" />
                        Tạo sự cố y tế
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Ẩn luôn 2 cột danh sách phụ huynh/học sinh khi là parent */}
      {!isParent && (
        <div className="grid grid-cols-3 gap-6">
          {/* Danh sách phụ huynh */}
          <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Danh sách phụ huynh
                {filteredParents.length > 0 && (
                  <span className="text-sm text-normal text-gray-500">
                    ({filteredParents.length} kết quả)
                  </span>
                )}
              </h2>
            </div>
            {/* Luôn hiển thị danh sách phụ huynh */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Đang tải...</span>
              </div>
            ) : filteredParents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  Không tìm thấy phụ huynh nào phù hợp với từ khóa tìm kiếm
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredParents.map((parent, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedParent(parent);
                      fetchStudentsByParentId(parent.id);
                    }}
                    className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                      selectedParent && selectedParent.id === parent.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {parent.fullName}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {parent.email}
                        </p>
                        <p className="text-sm text-gray-500">{parent.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danh sách học sinh */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {selectedParent
                  ? `Danh sách học sinh của ${selectedParent.fullName}`
                  : "Danh sách học sinh"}
                {students.length > 0 && (
                  <span className="text-sm text-normal text-gray-500">
                    ({students.length} học sinh)
                  </span>
                )}
              </h2>
              {selectedParent && (
                <button
                  onClick={() => {
                    setSelectedParent(null);
                    setStudents([]);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đóng
                </button>
              )}
            </div>
            {/* Luôn hiển thị danh sách học sinh */}
            {studentsLoadingForSearch ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">
                  Đang tải danh sách học sinh...
                </span>
              </div>
            ) : !selectedParent ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  Vui lòng chọn phụ huynh để xem danh sách học sinh
                </p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  Không tìm thấy học sinh nào cho phụ huynh này
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedStudentId(student.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {student.fullName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Mã học sinh: {student.studentCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          Giới tính: {student.gender}
                        </p>
                        <p className="text-sm text-gray-500">
                          Ngày sinh:{" "}
                          {new Date(student.dateOfBirth).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                        {student.studentClass && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-1">
                              Lớp học:
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                              {student.studentClass.className}
                            </p>
                            <p className="text-xs text-gray-500">
                              Phòng: {student.studentClass.classRoom}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Danh sách sự cố y tế */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">
          {isParent ? "Sự cố y tế của con bạn" : "Danh sách sự cố y tế"}
        </h2>
        {incidentsLoading ? (
          <div>Đang tải...</div>
        ) : incidents.length === 0 ? (
          <div>Không có sự cố y tế nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white border border-gray-200 rounded-lg text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Học sinh</th>
                  <th className="px-4 py-2 border-b">Lớp</th>
                  <th className="px-4 py-2 border-b">Loại sự cố</th>
                  <th className="px-4 py-2 border-b">Mô tả</th>
                  <th className="px-4 py-2 border-b">Trạng thái</th>
                  <th className="px-4 py-2 border-b">Ngày & giờ tạo</th>
                  <th className="px-4 py-2 border-b">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => {
                  return (
                    <tr
                      key={incident.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-2 text-center">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleViewClick(incident.id)}
                        >
                          Xem
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        {incident.studentName || "-"}
                      </td>
                      <td className="px-4 py-2">{incident.class || "-"}</td>
                      <td className="px-4 py-2">{incident.type}</td>
                      <td className="px-4 py-2">
                        {(() => {
                          // Mapping trạng thái sang tiếng Việt và badge màu
                          let label = "";
                          let color = "";
                          switch (incident.status?.toLowerCase()) {
                            case "pending":
                            case "chưa xử lý":
                              label = "Chờ xử lý";
                              color = "bg-yellow-100 text-yellow-800";
                              break;
                            case "resolved":
                            case "đã xử lý":
                              label = "Đã xử lý";
                              color = "bg-green-100 text-green-800";
                              break;
                            case "rejected":
                            case "từ chối":
                              label = "Từ chối";
                              color = "bg-red-100 text-red-800";
                              break;
                            default:
                              label = incident.status || "-";
                              color = "bg-gray-100 text-gray-800";
                          }
                          return (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}
                            >
                              {label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-2">
                        {(() => {
                          const dateStr: string =
                            typeof incident.incidentDate === "string"
                              ? incident.incidentDate
                              : "";
                          if (!dateStr) return "-";
                          const d = new Date(dateStr);
                          if (isNaN(d.getTime())) return "-";
                          const date = d.toLocaleDateString("vi-VN");
                          const time = d.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          return `${date} ${time}`;
                        })()}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => {
                            setDetailIncident(incident);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal tạo sự cố y tế */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        className="mx-auto w-full max-w-3xl bg-gray-50 rounded-xl shadow-2xl p-8 flex flex-col gap-6 ring-1 ring-gray-200"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">
          Tạo sự cố y tế
        </h2>
        <form className="flex flex-col gap-4">
          {/* Checkbox yêu cầu thuốc */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="requireMedicine"
              checked={requireMedicine}
              onChange={(e) => setRequireMedicine(e.target.checked)}
              className="w-4 h-4"
            />
            <label
              htmlFor="requireMedicine"
              className="text-sm font-medium text-gray-700"
            >
              Yêu cầu thuốc
            </label>
          </div>
          {/* Đơn thuốc động */}
          {requireMedicine && (
            <div className="border rounded-lg p-4 mb-4 bg-blue-50">
              <h4 className="font-semibold mb-2 text-blue-700">
                Thông tin thuốc
              </h4>
              {medicines.map((med, idx) => (
                <div key={idx} className="mb-4 border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-700">
                      Thuốc {idx + 1}
                    </span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setMedicines(medicines.filter((_, i) => i !== idx))
                        }
                        className="text-red-500"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  {/* Chọn thuốc */}
                  <Label>Chọn thuốc *</Label>
                  <SearchableSelect
                    options={medicineOptions}
                    value={med.medicationName}
                    onChange={(val) => {
                      const next = [...medicines];
                      next[idx].medicationName = val;
                      setMedicines(next);
                    }}
                  />
                  {/* Liều lượng */}
                  <Label className="mt-3">Liều dùng *</Label>
                  <input
                    type="text"
                    placeholder="VD: 2 viên/lần"
                    value={med.dosage}
                    onChange={(e) => {
                      const next = [...medicines];
                      next[idx].dosage = e.target.value;
                      setMedicines(next);
                    }}
                    className="w-full border rounded px-2 py-1"
                  />
                  {/* Tổng số lượng */}
                  <Label className="mt-3">Tổng số lượng *</Label>
                  <input
                    type="number"
                    min={1}
                    max={
                      medicineOptions.find(
                        (m) => m.value === med.medicationName
                      )?.stock ?? 999
                    }
                    value={med.totalQuantity}
                    onChange={(e) => {
                      const next = [...medicines];
                      next[idx].totalQuantity = Number(e.target.value);
                      setMedicines(next);
                    }}
                    className="w-full border rounded px-2 py-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Còn trong kho:{" "}
                    {medicineOptions.find((m) => m.value === med.medicationName)
                      ?.stock ?? 0}{" "}
                    viên
                  </p>
                </div>
              ))}
              {/* Thêm thuốc */}
              <button
                type="button"
                onClick={() =>
                  setMedicines([
                    ...medicines,
                    {
                      medicationName: "",
                      form: "",
                      dosage: "",
                      route: "",
                      frequency: 1,
                      totalQuantity: 1,
                      timeToAdminister: [""],
                      startDate: "",
                      endDate: "",
                      notes: "",
                    },
                  ])
                }
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                + Thêm thuốc
              </button>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold text-gray-700">
              Loại sự cố <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={incidentForm.type}
              onChange={(e) =>
                setIncidentForm((f) => ({ ...f, type: e.target.value }))
              }
              placeholder="Nhập loại sự cố..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold text-gray-700">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[80px]"
              value={incidentForm.description}
              onChange={(e) =>
                setIncidentForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
              placeholder="Nhập mô tả chi tiết..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold text-gray-700">
              Trạng thái
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={incidentForm.status}
              onChange={(e) =>
                setIncidentForm((f) => ({
                  ...f,
                  status: Number(e.target.value),
                }))
              }
            >
              <option value={0}>Chưa xử lý</option>
              <option value={1}>Đã xử lý</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold text-gray-700">
              Ngày xảy ra sự cố <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={incidentForm.incidentDate}
              onChange={(e) =>
                setIncidentForm((f) => ({
                  ...f,
                  incidentDate: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold text-gray-700">
              Giờ xảy ra sự cố <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={incidentForm.incidentTime}
              onChange={(e) =>
                setIncidentForm((f) => ({
                  ...f,
                  incidentTime: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              onClick={() => setShowCreateModal(false)}
            >
              Hủy
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              onClick={handleCreateIncident}
            >
              Tạo mới
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal chi tiết sự cố y tế */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setDetailIncident(null);
        }}
        className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow"
      >
        {loadingDetail ? (
          <p>Đang tải...</p>
        ) : detailIncident ? (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Chi tiết sự cố</h3>
            <p>
              <strong>Học sinh:</strong> {detailIncident.studentName}
            </p>
            <p>
              <strong>Loại:</strong> {detailIncident.type}
            </p>
            <p>
              <strong>Mô tả:</strong> {detailIncident.description}
            </p>
            <p>
              <strong>Ngày giờ:</strong>{" "}
              {detailIncident && detailIncident.incidentDate
                ? new Date(detailIncident.incidentDate).toLocaleString("vi-VN")
                : "-"}
            </p>
            {detailIncident &&
              Array.isArray(detailIncident.medicalUsageDetails) &&
              detailIncident.medicalUsageDetails.length > 0 && (
                <>
                  <h4 className="font-medium">Thuốc đã dùng:</h4>
                  <ul className="list-disc list-inside">
                    {detailIncident.medicalUsageDetails.map((m) => (
                      <li key={m.id}>
                        {m.medicalName} – {m.dosage} – SL: {m.quantity}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            <div className="text-right mt-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <p>Không tìm thấy chi tiết.</p>
        )}
      </Modal>
    </div>
  );
}
