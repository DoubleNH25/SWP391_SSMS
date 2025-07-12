import { TaskIcon } from "@/components/icons";
import Label from "@/components/ui/form/Label";
import PageHeader from "@/components/ui/PageHeader";
import { FecthParents, FecthStudentsByParentId } from "@/services/UserService";
import { ParentViewModel } from "@/types/User";
import { Student } from "@/types/Student";
import { Search, X, Users, ArrowRight, FilePlusIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "@/components/ui/form/SearchableSelect";
import MultiMedicationModal from "@/components/medicalrequest/MultiMedicationModal";
import {
  FecthMedicalRequest,
  FecthMedicalRequestById,
} from "@/services/MedicalRequest";
import {
  ListMedicalRequestViewModel,
  MedicalRequestViewModel,
} from "@/types/MedicalRequest";
import { Modal } from "@/components/ui/modal";
import UpdateMedicationModal from "@/components/medicalrequest/UpdateMedicationModal";
import { FecthUpdateMedicalRequest } from "@/services/MedicalRequest";
import DeleteConfirmationModal from "@/components/medicalrequest/DeleteConfirmationModal";
import { FecthDeleteMedicalRequest } from "@/services/MedicalRequest";

export default function MedicalRequest() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [parents, setParents] = useState<ParentViewModel[]>([]);
  const [filteredParents, setFilteredParents] = useState<ParentViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [selectedParent, setSelectedParent] = useState<ParentViewModel | null>(
    null
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [studentOptions, setStudentOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [studentsLoadingForSearch, setStudentsLoadingForSearch] =
    useState(false);

  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] =
    useState<Student | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const [medicalRequests, setMedicalRequests] = useState<
    ListMedicalRequestViewModel[]
  >([]);
  const [medicalRequestsLoading, setMedicalRequestsLoading] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [medicalRequestDetail, setMedicalRequestDetail] =
    useState<MedicalRequestViewModel | null>(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateRequest, setUpdateRequest] = useState<any>({});
  const [selectedDeleteRequest, setSelectedDeleteRequest] = useState<{
    [key: string]: any;
  } | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchParent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await FecthParents();
      setParents(response || []);
      setFilteredParents(response || []);
    } catch (err) {
      console.error("Failed to fetch parent:", err);
      setParents([]);
      setFilteredParents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudentsByParentId = useCallback(async (parentId: string) => {
    setStudentsLoading(true);
    try {
      const response = await FecthStudentsByParentId(parentId);
      setStudents(response || []);
    } catch (err) {
      console.error("Failed to fetch students by parent ID:", err);
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  const handleParentClick = useCallback(
    (parent: ParentViewModel) => {
      setSelectedParentId(parent.id);
      setSelectedParent(parent);
      fetchStudentsByParentId(parent.id);
    },
    [fetchStudentsByParentId]
  );

  const handleNavigateToStudent = useCallback(() => {
    if (selectedStudentId) {
      navigate(
        `/dashboard/medical/manager-medical-request/${selectedStudentId}`
      );
    }
  }, [selectedStudentId, navigate]);

  const handleStudentClick = useCallback((student: Student | null) => {
    if (student) {
      setSelectedStudentForModal(student);
      setSelectedStudentId(student.id);
      setSelectedParentId(student.parentId || "");
      setShowMedicationModal(true);
    }
  }, []);

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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStudentId("");
  };

  const handleNavigateCreateMedicalRequest = useCallback(() => {
    if (selectedStudentId) {
      const student = allStudents.find((s) => s.id === selectedStudentId);
      if (student) {
        // If no parent is selected, try to get parent ID from student
        if (!selectedParentId && student.parentId) {
          setSelectedParentId(student.parentId);
        }
        setSelectedStudentForModal(student);
        setShowMedicationModal(true);
      }
    }
  }, [selectedStudentId, allStudents, selectedParentId]);

  const fetchMedicalRequests = useCallback(async () => {
    setMedicalRequestsLoading(true);
    try {
      const data = await FecthMedicalRequest();
      setMedicalRequests(data || []);
    } catch (err) {
      setMedicalRequests([]);
    } finally {
      setMedicalRequestsLoading(false);
    }
  }, []);

  const handleShowDetail = async (id: string) => {
    setDetailLoading(true);
    setShowDetailModal(true);
    try {
      const detail = await FecthMedicalRequestById(id);
      setMedicalRequestDetail(detail);
    } catch (err) {
      setMedicalRequestDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEdit = () => {
    if (!medicalRequestDetail) return;
    setUpdateRequest({
      parentName: medicalRequestDetail.parentName,
      phoneNumber: medicalRequestDetail.phoneNumber,
      studentName: medicalRequestDetail.studentName,
      medicationName: medicalRequestDetail.medicationName,
      form: "",
      dosage: "",
      route: "",
      frequency: 1,
      totalQuantity: medicalRequestDetail.totalQuantity,
      timeToAdminister: medicalRequestDetail.timeToAdminister,
      startDate: medicalRequestDetail.startDate,
      endDate: medicalRequestDetail.endDate,
      note: medicalRequestDetail.notes,
    });
    setShowUpdateModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!medicalRequestDetail) return;
    try {
      // Map lại dữ liệu đúng format API
      const payload = {
        studentId: medicalRequestDetail.studentId,
        parentId: medicalRequestDetail.parentId,
        medicalRequestItems: [
          {
            medicationName: updateRequest.medicationName,
            form: updateRequest.form,
            dosage: updateRequest.dosage,
            route: updateRequest.route,
            frequency: updateRequest.frequency,
            totalQuantity: Number(updateRequest.totalQuantity),
            timeToAdminister: updateRequest.timeToAdminister,
            startDate: updateRequest.startDate,
            endDate: updateRequest.endDate,
            notes: updateRequest.note,
          },
        ],
      };
      await FecthUpdateMedicalRequest(medicalRequestDetail.id, payload);
      setShowUpdateModal(false);
      setShowDetailModal(false);
      await fetchMedicalRequests();
      await handleShowDetail(medicalRequestDetail.id);
    } catch (err: any) {
      alert(err.message || "Cập nhật đơn thuốc thất bại");
    }
  };

  const handleDeleteClick = (req: any) => {
    setSelectedDeleteRequest({
      medicationRequestId: req.id,
      studentName: req.studentName,
      medicationName: req.medicationName,
    });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!(selectedDeleteRequest && selectedDeleteRequest.medicationRequestId))
      return;
    try {
      await FecthDeleteMedicalRequest(
        selectedDeleteRequest.medicationRequestId
      );
      setShowDeleteModal(false);
      await fetchMedicalRequests();
    } catch (err: any) {
      alert(err.message || "Xóa đơn thuốc thất bại");
    } finally {
      setSelectedDeleteRequest(null);
    }
  };

  const fetchAllStudents = useCallback(async () => {
    setStudentsLoadingForSearch(true);
    try {
      // Giả sử bạn có API lấy toàn bộ học sinh
      // const response = await FecthStudents();
      // setAllStudents(response || []);
      // setStudentOptions(...)
    } finally {
      setStudentsLoadingForSearch(false);
    }
  }, []);

  const handleStudentSelect = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
  }, []);

  useEffect(() => {
    fetchParent();
    fetchAllStudents();
    fetchMedicalRequests();
  }, [fetchParent, fetchAllStudents, fetchMedicalRequests]);

  useEffect(() => {
    filterParents();
  }, [filterParents]);

  return (
    <div className="p-6">
      <PageHeader
        title="Yêu cầu y tế"
        icon={<TaskIcon className="w-10 h-10" />}
        description="Yêu cầu dịch vụ y tế từ phụ huynh"
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
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label htmlFor="search">Tìm kiếm phụ huynh</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Tìm kiếm theo tên phụ huynh, email, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="student-search">Tìm kiếm học sinh</Label>
              <div className="flex flex-wrap gap-2 items-start">
                {/* Ô chọn học sinh */}
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

                {/* Các nút chức năng */}
                <div className="flex flex-row gap-3 items-start">
                  {/* Nút xem đơn thuốc */}
                  <div className="flex flex-col gap-2 items-stretch">
                    <button
                      onClick={handleNavigateToStudent}
                      disabled={!selectedStudentId || studentsLoadingForSearch}
                      className="inline-flex items-center gap-2 px-4 py-2 h-[44px] text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Xem đơn thuốc
                    </button>
                  </div>
                  {/* Cụm 2 nút dọc */}
                  <div className="flex flex-col gap-2 items-stretch">
                    <button
                      onClick={handleNavigateCreateMedicalRequest}
                      disabled={!selectedStudentId || studentsLoadingForSearch}
                      className="inline-flex items-center gap-2 px-4 py-2 h-[44px] text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                      <FilePlusIcon className="w-4 h-4" />
                      Tạo đơn thuốc
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {(searchTerm || selectedStudentId) && (
            <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {searchTerm && (
                  <>
                    Hiển thị kết quả phụ huynh cho{" "}
                    <span className="font-medium">"{searchTerm}"</span>
                  </>
                )}
                {searchTerm && selectedStudentId && " | "}
                {selectedStudentId && (
                  <>
                    Đã chọn học sinh:{" "}
                    <span className="font-medium">
                      {studentOptions.find(
                        (opt) => opt.value === selectedStudentId
                      )?.label || "N/A"}
                    </span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Parent Results Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Danh sách phụ huynh
              {filteredParents.length > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({filteredParents.length} kết quả)
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : filteredParents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchTerm
                  ? "Không tìm thấy phụ huynh nào phù hợp với từ khóa tìm kiếm"
                  : "Nhập từ khóa để tìm kiếm phụ huynh"}
              </p>
              {searchTerm && (
                <p className="text-xs text-gray-400 mt-2">
                  Tổng số phụ huynh: {parents.length} | Đã lọc:{" "}
                  {filteredParents.length}
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredParents.map((parent, index) => (
                <div
                  key={index}
                  onClick={() => handleParentClick(parent)}
                  className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                    selectedParentId === parent.id
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

        {/* Students Results Section */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {selectedParent
                ? `Danh sách học sinh của ${selectedParent.fullName}`
                : "Danh sách học sinh"}
              {students.length > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({students.length} học sinh)
                </span>
              )}
            </h2>
            {selectedParent && (
              <button
                onClick={() => {
                  setSelectedParent(null);
                  setSelectedParentId("");
                  setStudents([]);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
                Đóng
              </button>
            )}
          </div>

          {studentsLoading ? (
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
                  onClick={() => handleStudentClick(student)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
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
      {/* Multi Medication Modal */}
      <MultiMedicationModal
        isOpen={showMedicationModal}
        parentId={selectedParentId}
        studentId={selectedStudentId}
        onClose={() => {
          setShowMedicationModal(false);
          setSelectedStudentForModal(null);
        }}
        selectedStudent={selectedStudentForModal}
        onSubmit={(medications) => {
          fetchMedicalRequests(); // Refresh list after create
        }}
      />

      {/* Danh sách đơn thuốc */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Danh sách đơn thuốc</h2>
        {medicalRequestsLoading ? (
          <div>Đang tải...</div>
        ) : medicalRequests.length === 0 ? (
          <div>Không có đơn thuốc nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b">Học sinh</th>
                  <th className="px-3 py-2 border-b">Lớp</th>
                  <th className="px-3 py-2 border-b">Phụ huynh</th>
                  <th className="px-3 py-2 border-b">Thuốc</th>
                  <th className="px-3 py-2 border-b">Số lượng tổng</th>
                  <th className="px-3 py-2 border-b">Số lượng còn lại</th>
                  <th className="px-3 py-2 border-b">Trạng thái</th>
                  <th className="px-3 py-2 border-b">Ngày tạo</th>
                  <th className="px-3 py-2 border-b">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {medicalRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleShowDetail(req.id)}
                  >
                    <td className="px-3 py-2">{req.studentName}</td>
                    <td className="px-3 py-2">{req.studentClass}</td>
                    <td className="px-3 py-2">{req.parentName}</td>
                    <td className="px-3 py-2">{req.medicationName}</td>
                    <td className="px-3 py-2">{req.totalQuantity}</td>
                    <td className="px-3 py-2">{req.remainingQuantity}</td>
                    <td className="px-3 py-2">{req.status}</td>
                    <td className="px-3 py-2">
                      {new Date(req.createdTime).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(req);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal xem chi tiết đơn thuốc */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setMedicalRequestDetail(null);
        }}
      >
        <div className="p-6 min-w-[350px] max-w-[500px]">
          <h3 className="text-lg font-semibold mb-4">Chi tiết đơn thuốc</h3>
          {detailLoading ? (
            <div>Đang tải...</div>
          ) : !medicalRequestDetail ? (
            <div>Không tìm thấy thông tin đơn thuốc.</div>
          ) : (
            <div className="space-y-2">
              <div>
                <b>Học sinh:</b> {medicalRequestDetail.studentName}
              </div>
              <div>
                <b>Lớp:</b> {medicalRequestDetail.studentClass}
              </div>
              <div>
                <b>Phụ huynh:</b> {medicalRequestDetail.parentName}
              </div>
              <div>
                <b>Thuốc:</b> {medicalRequestDetail.medicationName}
              </div>
              <div>
                <b>Số lượng tổng:</b> {medicalRequestDetail.totalQuantity}
              </div>
              <div>
                <b>Số lượng còn lại:</b>{" "}
                {medicalRequestDetail.remainingQuantity}
              </div>
              <div>
                <b>Thời gian dùng:</b>{" "}
                {medicalRequestDetail.timeToAdminister?.join(", ")}
              </div>
              <div>
                <b>Ngày bắt đầu:</b> {medicalRequestDetail.startDate}
              </div>
              <div>
                <b>Ngày kết thúc:</b> {medicalRequestDetail.endDate}
              </div>
              <div>
                <b>Trạng thái:</b> {medicalRequestDetail.status}
              </div>
              <div>
                <b>Ngày tạo:</b>{" "}
                {new Date(medicalRequestDetail.createdTime).toLocaleDateString(
                  "vi-VN"
                )}
              </div>
              <div>
                <b>Ghi chú:</b> {medicalRequestDetail.notes || "-"}
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Sửa
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal cập nhật đơn thuốc */}
      <UpdateMedicationModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        updateRequest={updateRequest}
        setUpdateRequest={setUpdateRequest}
        onConfirm={handleConfirmUpdate}
        medicationForms={[
          "Viên nén",
          "Siro",
          "Thuốc nhỏ mắt",
          "Kem bôi",
          "Viên con nhộng",
          "Thuốc tiêm",
          "Thuốc mỡ",
          "Thuốc đặt",
          "Thuốc hít",
          "Vắc-xin",
        ]}
        routes={["Uống", "Tiêm", "Bôi ngoài da", "Nhỏ mắt", "Đặt", "Hít"]}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedRequest={selectedDeleteRequest}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
