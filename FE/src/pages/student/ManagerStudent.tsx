import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon, PencilIcon, TrashBinIcon } from "@/components/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "@/components/ui/modal";
import {
  PlusIcon,
  Users,
  X,
  Search,
  EyeIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  FecthDeleteStudents,
  FecthImportUserByExcel,
  FecthStudents,
} from "@/services/UserService";
import { FecthClass } from "@/services/SchoolClassService";
import { Student } from "@/types/Student";
import { SchoolClass } from "@/types/SchoolClass";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageHeader from "@/components/ui/PageHeader";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import { ImportFileModal } from "@/components/ui/FileUploadModal";

type SortDirection = "asc" | "desc" | null;

export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [importLoading, setImportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [sortField, setSortField] = useState<"studentCode">("studentCode");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get classId from URL parameters
  const classIdFilter = searchParams.get("classId");

  // Extract grade levels from class data
  const gradeLevels = Array.from(
    new Set(
      classes.map((cls) => {
        const gradeMatch = cls.className.match(/^(\d+)/);
        return gradeMatch ? gradeMatch[1] : "0";
      })
    )
  )
    .filter((grade) => grade !== "0")
    .sort();

  // Filter and sort students
  const filteredStudents = students.filter((student) => {
    const matchesClass =
      !classIdFilter || student.studentClass.id === classIdFilter;
    const matchesSearch =
      !searchTerm ||
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentClass.className
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === "all" ||
      student.studentClass.className.startsWith(selectedGrade);
    return matchesClass && matchesSearch && matchesGrade;
  });

  // Sort students based on student code
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    if (sortField === "studentCode") {
      return sortDirection === "asc"
        ? a.studentCode.localeCompare(b.studentCode)
        : b.studentCode.localeCompare(a.studentCode);
    }
    return 0;
  });

  const totalItems = sortedStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedStudents, fetchedClasses] = await Promise.all([
        FecthStudents(),
        FecthClass(),
      ]);
      setStudents(fetchedStudents);
      setClasses(fetchedClasses);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("authenticated")
          ? "Vui lòng đăng nhập để xem học sinh."
          : "Không thể lấy dữ liệu học sinh. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    navigate("/student/add-student");
  };

  const handleConfirmDeleteStudent = async () => {
    if (!selectedStudentId) return;
    setDeleteLoading(true);
    try {
      const success = await FecthDeleteStudents(selectedStudentId);
      if (success) {
        setStudents(students.filter((user) => user.id !== selectedStudentId));
        toast.success("Student deleted successfully");
      } else {
        throw new Error("Deletion failed");
      }
      setIsDeleteModalOpen(false);
      setSelectedStudentId(null);
      setError(null);
    } catch (error) {
      toast.error(
        `Failed to delete student: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenDeleteModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedStudentId(null);
  };

  const handleUpdateStudent = (studentId: string) => {
    navigate(`/student/update-student/${studentId}`);
  };

  const handleViewHealthProfile = (studentId: string) => {
    navigate(`/healthprofile/manager-health-profile/${studentId}`);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleImport = async (file: File) => {
    if (!file) {
      toast.error("Vui lòng chọn file Excel!");
      return;
    }
    setImportLoading(true);
    try {
      const success = await FecthImportUserByExcel(file);
      if (success) {
        const fetchedStudents = await FecthStudents();
        setStudents(fetchedStudents);
        toast.success("Import học sinh thành công!");
        setIsImportModalOpen(false);
      } else {
        throw new Error("Import thất bại");
      }
    } catch (error) {
      toast.error(
        `Lỗi khi import file: ${
          error instanceof Error ? error.message : "Lỗi không xác định"
        }`
      );
    } finally {
      setImportLoading(false);
    }
  };

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    if (!importLoading) {
      setIsImportModalOpen(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGrade("all");
    setCurrentPage(1);
    // Remove classId from URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("classId");
    setSearchParams(newSearchParams);
  };

  // Get the class name for display
  const getFilteredClassName = () => {
    if (!classIdFilter) return null;
    const student = students.find((s) => s.studentClass.id === classIdFilter);
    return student?.studentClass.className || null;
  };

  const handleSortStudentCode = () => {
    setSortDirection((current) => {
      if (current === "asc") return "desc";
      if (current === "desc") return null;
      return "asc";
    });
    setSortField("studentCode");
  };

  const handleViewHealthCheckupRecords = (studentId: string) => {
    navigate(`/student/${studentId}/health-checkup-records`);
  };

  return (
    <div className="p-4">
      <PageHeader
        title="Quản lý học sinh"
        icon={<Users className="w-6 h-6 text-blue-600" />}
        description="Quản lý thông tin học sinh trong hệ thống"
      />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Bộ lọc tìm kiếm
            </h2>
            {(searchTerm || selectedGrade !== "all" || classIdFilter) && (
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
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Tìm kiếm theo tên, mã học sinh hoặc lớp..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
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
            <div className="w-1/2">
              <Label htmlFor="grade">Khối lớp</Label>
              <Select
                options={[
                  { value: "all", label: "Tất cả" },
                  ...gradeLevels.map((grade) => ({
                    value: grade,
                    label: `Khối ${grade}`,
                  })),
                ]}
                defaultValue={selectedGrade}
                onChange={(value) => {
                  setSelectedGrade(value);
                  setCurrentPage(1);
                }}
                className="w-full"
                placeholder="Chọn khối lớp"
              />
            </div>
          </div>
          {(searchTerm || selectedGrade !== "all" || classIdFilter) && (
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
                Hiển thị kết quả cho{" "}
                {searchTerm && (
                  <span className="font-medium">"{searchTerm}"</span>
                )}
                {searchTerm &&
                  (selectedGrade !== "all" || classIdFilter) &&
                  " và "}
                {selectedGrade !== "all" && (
                  <span className="font-medium">khối {selectedGrade}</span>
                )}
                {selectedGrade !== "all" && classIdFilter && " và "}
                {classIdFilter && (
                  <span className="font-medium">
                    lớp {getFilteredClassName()}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div
          role="alert"
          className="text-center text-red-500 p-4 bg-red-100 rounded"
        >
          <p>{error}</p>
          {error.includes("authenticated") ? (
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đăng nhập
            </button>
          ) : (
            <button
              onClick={fetchData}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          )}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center text-gray-600">Không có học sinh nào</div>
      ) : (
        <div className="space-y-6">
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            showCloseButton={true}
            isFullscreen={false}
            className="max-w-md p-6"
          >
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa
              </h2>
              <p className="mt-2 text-gray-600">
                Bạn có chắc chắn muốn xóa học sinh này? Hành động này không thể
                hoàn tác.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleConfirmDeleteStudent}
                  className="rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
                >
                  {deleteLoading ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </Modal>
          <ImportFileModal
            isOpen={isImportModalOpen}
            onClose={handleCloseImportModal}
            onUpload={handleImport}
            loading={importLoading}
            title="Import học sinh từ Excel"
            acceptedFileTypes={[".xlsx", ".xls"]}
            maxFileSize={10}
          />
          <div className="flex items-center justify-end mb-6 absolute right-[16px] top-[140px]">
            <div className="flex items-center gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                onClick={handleAddStudent}
              >
                <PlusIcon className="w-4 h-4" />
                Thêm học sinh mới
              </button>
              <button
                onClick={handleOpenImportModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <FileIcon className="w-4 h-4" />
                Import từ Excel
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={handleSortStudentCode}
                        className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      >
                        Mã học sinh
                        {sortField === "studentCode" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : sortDirection === "desc" ? (
                            <ArrowDown className="w-4 h-4" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-gray-300" />
                          ))}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giới tính
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày sinh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lớp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-2 whitespace-nowrap">
                        {student.studentCode}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <img
                              className="h-5 w-5 rounded-full"
                              src={
                                student.image ||
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {student.gender === "Male" ? "Nam" : "Nữ"}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.dateOfBirth).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {student.studentClass.className}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {student.studentClass.classRoom}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStudent(student.id)}
                            className="hover:bg-blue-500 hover:text-white"
                          >
                            <PencilIcon className="size-4" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(student.id)}
                            className="hover:bg-red-500 hover:text-white"
                          >
                            <TrashBinIcon className="size-4" />
                            Xóa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewHealthProfile(student.id)}
                            className="hover:bg-blue-500 hover:text-white"
                          >
                            <EyeIcon className="size-4" />
                            Hồ sơ sức khỏe
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewHealthCheckupRecords(student.id)
                            }
                            className="hover:bg-blue-500 hover:text-white"
                          >
                            <EyeIcon className="size-4" />
                            Lịch sử khám sức khỏe
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy học sinh nào
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Trang trước
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Trang sau
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{" "}
                  của <span className="font-medium">{totalItems}</span> kết quả
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Hiển thị</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                  >
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="24">24</option>
                  </select>
                  <span className="text-sm text-gray-700">mục</span>
                </div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Trang trước</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === page
                            ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Trang sau</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
