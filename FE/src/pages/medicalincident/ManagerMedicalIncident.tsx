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
import { ParentViewModel } from "@/types/User";
import { Student } from "@/types/Student";
import { useState, useEffect, useCallback } from "react";
import SearchableSelect from "@/components/ui/form/SearchableSelect";
import {
  FetchAllIncidentsWithoutStudentId,
  Incident,
  FecthAllIncidents as FetchIncidentsByStudent,
} from "@/services/IncidentService";
import { Modal } from "@/components/ui/modal";

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
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  // Thêm lại allStudents vào state để map studentId sang tên và lớp
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  // State cho modal tạo sự cố y tế
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    type: "",
    description: "",
    status: 0,
    incidentDate: "",
  });

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
      setAllStudents(response || []);
      const options = (response || []).map((student) => ({
        value: student.id,
        label: `${student.studentCode} - ${student.fullName} (${
          student.studentClass?.className || "N/A"
        })`,
      }));
      setStudentOptions(options);
    } catch {
      setAllStudents([]);
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
      let data: Incident[] = [];
      if (selectedStudentId) {
        data = await FetchIncidentsByStudent(selectedStudentId);
      } else {
        data = await FetchAllIncidentsWithoutStudentId();
      }
      setIncidents(data || []);
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

  // Thêm logic tạo sự cố y tế
  const handleCreateIncident = async () => {
    if (
      !selectedStudentId ||
      !incidentForm.type ||
      !incidentForm.description ||
      !incidentForm.incidentDate
    ) {
      showToast.warning("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }
    try {
      await FecthCreateIncident({
        studentId: selectedStudentId,
        type: incidentForm.type,
        description: incidentForm.description,
        incidentDate: incidentForm.incidentDate,
        medicalUsageDetails: [],
      });
      setShowCreateModal(false);
      setIncidentForm({
        type: "",
        description: "",
        status: 0,
        incidentDate: "",
      });
      fetchIncidents();
      showToast.success("Tạo sự cố y tế thành công!");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        showToast.error((err as any).message || "Tạo sự cố y tế thất bại!");
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

  // UI
  return (
    <div className="p-6">
      <PageHeader
        title="Sự cố y tế"
        icon={<AlertTriangleIcon className="w-10 h-10" />}
        description="Quản lý sự cố y tế của học sinh"
      />
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
                      disabled={!selectedStudentId || studentsLoadingForSearch}
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
                          <p className="text-xs text-gray-400 mb-1">Lớp học:</p>
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
      {/* Danh sách sự cố y tế */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Danh sách sự cố y tế</h2>
        {incidentsLoading ? (
          <div>Đang tải...</div>
        ) : incidents.length === 0 ? (
          <div>Không có sự cố y tế nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b">Học sinh</th>
                  <th className="px-3 py-2 border-b">Lớp</th>
                  <th className="px-3 py-2 border-b">Loại sự cố</th>
                  <th className="px-3 py-2 border-b">Mô tả</th>
                  <th className="px-3 py-2 border-b">Trạng thái</th>
                  <th className="px-3 py-2 border-b">Ngày tạo</th>
                  <th className="px-3 py-2 border-b">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => {
                  const student =
                    allStudents.find((s) => s.id === incident.studentId) ||
                    students.find((s) => s.id === incident.studentId);
                  return (
                    <tr
                      key={incident.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-3 py-2">
                        {student ? student.fullName : incident.studentId}
                      </td>
                      <td className="px-3 py-2">
                        {student && student.studentClass
                          ? student.studentClass.className
                          : "-"}
                      </td>
                      <td className="px-3 py-2">{incident.type}</td>
                      <td className="px-3 py-2">
                        {incident.description ||
                          incident.note ||
                          incident.details ||
                          "Không có mô tả"}
                      </td>
                      <td className="px-3 py-2">{incident.status}</td>
                      <td className="px-3 py-2">
                        {incident.createdTime
                          ? new Date(incident.createdTime).toLocaleDateString(
                              "vi-VN"
                            )
                          : ""}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => {
                            setSelectedIncident(incident);
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
      {/* Modal xem chi tiết sự cố y tế */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedIncident(null);
        }}
      >
        <div className="p-6 min-w-[350px] max-w-[500px]">
          <h3 className="text-lg font-semibold mb-4">Chi tiết sự cố y tế</h3>
          {!selectedIncident ? (
            <div>Không tìm thấy thông tin sự cố.</div>
          ) : (
            <div className="space-y-2">
              <div>
                <b>Học sinh:</b> {selectedIncident.studentId}
              </div>
              <div>
                <b>Loại sự cố:</b> {selectedIncident.type}
              </div>
              <div>
                <b>Mô tả:</b>{" "}
                {selectedIncident.description ||
                  selectedIncident.note ||
                  selectedIncident.details ||
                  "Không có mô tả"}
              </div>
              <div>
                <b>Trạng thái:</b> {selectedIncident.status}
              </div>
              <div>
                <b>Ngày tạo:</b>{" "}
                {new Date(selectedIncident.createdTime).toLocaleDateString(
                  "vi-VN"
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
      {/* Modal tạo sự cố y tế */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <div className="mx-auto w-full max-w-md bg-white rounded-xl shadow-2xl p-8 flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">
            Tạo sự cố y tế
          </h2>
          <form className="flex flex-col gap-4">
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
        </div>
      </Modal>
    </div>
  );
}
