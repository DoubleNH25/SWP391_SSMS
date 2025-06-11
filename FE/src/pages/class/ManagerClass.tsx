import { useEffect, useState } from "react";
import { PencilIcon, TrashBinIcon } from "@/components/icons"
import { useNavigate } from 'react-router-dom';
import { Modal } from "@/components/ui/modal";
import { PlusIcon, GraduationCap, Search, Users } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SchoolClass } from "@/types/SchoolClass";
import { FecthClass, FecthDeleteSchoolClass } from "@/services/SchoolClassService";
import PageHeader from "@/components/ui/PageHeader";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";

export default function CLassSchoolManager() {
  const [schoolClass, setSchoolClass] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchoolClassId, setSelectedSchoolClassId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const navigate = useNavigate();

  const getGradeOptions = (classes: SchoolClass[]) => {
    const grades = new Set<string>();
    classes.forEach(cls => {
      const gradeMatch = cls.className.match(/^(\d+)/);
      if (gradeMatch) {
        grades.add(gradeMatch[1]);
      }
    });

    const gradeArray = Array.from(grades).sort((a, b) => parseInt(a) - parseInt(b));

    return [
      { value: "all", label: "Tất cả khối" },
      ...gradeArray.map(grade => ({
        value: grade,
        label: `Khối ${grade}`
      }))
    ];
  };

  const filteredClasses = schoolClass.filter((cls) => {
    const matchesSearch = cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classRoom.toLowerCase().includes(searchTerm.toLowerCase());

    const gradeMatch = cls.className.match(/^(\d+)/);
    const classGrade = gradeMatch ? gradeMatch[1] : "";

    const matchesGrade = selectedGrade === "all" || classGrade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const totalItems = filteredClasses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClasses = filteredClasses.slice(startIndex, endIndex);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await FecthClass();
      setSchoolClass(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error && err.message.includes('authenticated')
        ? 'Vui lòng đăng nhập để xem lớp học.'
        : 'Không thể lấy dữ liệu lớp học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = () => {
    navigate('/class/add-class');
  };

  const handleConfirmDeleteSchoolCLass = async () => {
    if (!selectedSchoolClassId) return;
    setDeleteLoading(true);
    try {
      const success = await FecthDeleteSchoolClass(selectedSchoolClassId);
      if (success) {
        setSchoolClass(schoolClass.filter(SchoolClass => SchoolClass.id !== selectedSchoolClassId));
        toast.success('Lớp học đã được xóa thành công');
      } else {
        throw new Error('Xóa lớp học thất bại');
      }
      setIsDeleteModalOpen(false);
      setSelectedSchoolClassId(null);
      setError(null);
    } catch (error) {
      toast.error(`Không thể xóa lớp học: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenDeleteModal = (schoolClassId: string) => {
    setSelectedSchoolClassId(schoolClassId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSchoolClassId(null);
  };

  const handleUpdateSchoolClass = (schoolClassId: string) => {
    navigate(`/class/update-class/${schoolClassId}`);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleClassClick = (cls: SchoolClass) => {
    // Navigate to student management page with classId filter
    navigate(`/student?classId=${cls.id}`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGrade("all");
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <PageHeader
        title="Quản lý lớp học"
        icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
        description="Quản lý thông tin lớp học trong hệ thống"
      />
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div role="alert" className="text-center text-red-500 p-4 bg-red-100 rounded">
          <p>{error}</p>
          {error.includes('authenticated') ? (
            <button
              onClick={() => window.location.href = '/login'}
              aria-label="Log in to view students"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đăng nhập
            </button>
          ) : (
            <button
              onClick={fetchData}
              aria-label="Retry fetching students"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          )}
        </div>
      ) : schoolClass.length === 0 ? (
        <div className="text-center text-gray-600">Không có lớp học nào</div>
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
                Bạn có chắc chắn muốn xóa lớp học này? Hành động này không thể hoàn tác.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleConfirmDeleteSchoolCLass}
                  className="rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
                >
                  {deleteLoading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </Modal>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h2>
                {(searchTerm || selectedGrade !== "all") && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Xóa bộ lọc
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    Tìm kiếm theo tên lớp hoặc phòng học
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Nhập tên lớp hoặc phòng học..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setCurrentPage(1);
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-[50%]">
                  <Label className="block text-sm font-medium text-gray-700">
                    Lọc theo khối
                  </Label>
                  <Select
                    options={getGradeOptions(schoolClass)}
                    defaultValue={selectedGrade}
                    onChange={(value: string) => {
                      setSelectedGrade(value);
                      setCurrentPage(1);
                    }}
                    className="w-full"
                    placeholder="Chọn khối"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mb-6 absolute right-[16px] top-[115px]">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
              onClick={handleAddClass}
            >
              <PlusIcon className="w-4 h-4" />
              Thêm lớp mới
            </button>
          </div>

          {/* Class Grid */}
          {schoolClass.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 border border-gray-200 rounded-lg p-6">
              {paginatedClasses.map((cls: SchoolClass, index: number) => (
                <div key={index} className="space-y-4">
                  <div
                    className="bg-white rounded-xl shadow-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleClassClick(cls)}
                  >
                    <div className="mb-4 flex justify-between items-start">
                      <div className="w-[60%]">
                        <h2 className="text-xl font-semibold text-gray-800">{cls.className}</h2>
                      </div>
                      <span className="px-3 py-1 text-center rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {cls.students.length} học sinh
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        <span>Phòng học: {cls.classRoom}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Sức chứa: {cls.quantity}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateSchoolClass(cls.id);
                        }}
                        className="p-2 border rounded-lg border-blue-500 hover:text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <PencilIcon className="w-5 h-5" />
                        Sửa
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeleteModal(cls.id);
                        }}
                        className="p-2 border rounded-lg border-red-500 hover:text-white font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                        <TrashBinIcon className="w-5 h-5" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {schoolClass.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 font-medium">Không có lớp học nào</p>
              </div>
            </div>
          )}

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
                  Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{" "}
                  của{" "}
                  <span className="font-medium">
                    {totalItems}
                  </span>{" "}
                  kết quả
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
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Trang trước</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                        ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Trang sau</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
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
