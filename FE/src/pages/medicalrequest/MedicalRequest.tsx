import { TaskIcon } from "@/components/icons";
import Label from "@/components/ui/form/Label";
import PageHeader from "@/components/ui/PageHeader";
import {
  FecthParents,
  FecthStudentsByParentId,
  FecthStudents,
} from "@/services/UserService";
import { ParentViewModel } from "@/types/User";
import { Student } from "@/types/Student";
import { Search, X, Users, ArrowRight, PlusIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "@/components/ui/form/SearchableSelect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MultiMedicationModal from "@/components/medicalrequest/MultiMedicationModal";

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
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [studentsLoadingForSearch, setStudentsLoadingForSearch] =
    useState(false);

  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] =
    useState<Student | null>(null);

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

  const fetchAllStudents = useCallback(async () => {
    setStudentsLoadingForSearch(true);
    try {
      const response = await FecthStudents();
      setAllStudents(response || []);
      const options = (response || []).map((student) => ({
        value: student.id,
        label: `${student.studentCode} - ${student.fullName} (${student.studentClass?.className || "N/A"
          })`,
      }));
      setStudentOptions(options);
    } catch (err) {
      console.error("Failed to fetch all students:", err);
      setAllStudents([]);
      setStudentOptions([]);
    } finally {
      setStudentsLoadingForSearch(false);
    }
  }, []);

  const handleStudentSelect = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
  }, []);

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

  const handleNavigateToStudent = useCallback(() => {
    if (selectedStudentId) {
      navigate(`/medical/manager-medical-request/${selectedStudentId}`);
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

  const handleMedicationSubmit = useCallback(
    (medications: any[]) => {
      console.log("Medications submitted:", medications);
      console.log("For student:", selectedStudentForModal);
      // Here you would typically save to backend
      // For now, just show success message
      alert(
        `Đã tạo đơn thuốc thành công cho học sinh ${selectedStudentForModal?.fullName} với ${medications.length} loại thuốc!`
      );
      setShowMedicationModal(false);
      setSelectedStudentForModal(null);
    },
    [selectedStudentForModal]
  );

  useEffect(() => {
    fetchParent();
    fetchAllStudents();
  }, [fetchParent, fetchAllStudents]);

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="!top-20"
        style={{
          fontSize: '14px',
          fontWeight: '500'
        }}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <div className="flex gap-2">
                <div className="flex-1">
                  <SearchableSelect
                    options={studentOptions}
                    placeholder={
                      studentsLoadingForSearch
                        ? "Đang tải..."
                        : "Chọn học sinh theo mã hoặc tên..."
                    }
                    onChange={handleStudentSelect}
                    value={selectedStudentId}
                    className="w-[90%]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleNavigateToStudent}
                    disabled={!selectedStudentId || studentsLoadingForSearch}
                    className="inline-flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Xem đơn thuốc
                  </button>
                  <button
                    onClick={handleNavigateCreateMedicalRequest}
                    disabled={!selectedStudentId || studentsLoadingForSearch}
                    className="inline-flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Tạo đơn thuốc
                  </button>
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
                  className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${selectedParentId === parent.id
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
        onSubmit={handleMedicationSubmit}
      />
    </div>
  );
}
