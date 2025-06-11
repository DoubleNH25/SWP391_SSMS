import {
  FecthCreateConselingSchedule,
  FecthHealthCheckup,
} from "@/services/HealthProfileService";
import { MedicalHealthCheckupRecord } from "@/types/MedicalRecord";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Modal } from "@/components/ui/modal";
import { ConselingSchedules } from "@/types/ConselingSchedules";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  customFormatDateOnly,
  customFormatDateForBackend,
} from "@/types/CalendarEvent";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/InputField";
import PageHeader from "@/components/ui/PageHeader";
import { LightbulbIcon } from "lucide-react";

export default function ManagerRecord() {
  const [healthCheckup, setHealthCheckup] = useState<
    MedicalHealthCheckupRecord[]
  >([]);
  const [filteredRecords, setFilteredRecords] = useState<
    MedicalHealthCheckupRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const [showConsultForm, setShowConsultForm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const [formData, setFormData] = useState<ConselingSchedules>({
    studentId: "",
    healthCheckupId: "",
    note: "",
    requestDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notify = {
    success: (message: string) =>
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }),
    error: (message: string) =>
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }),
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !formData.studentId ||
        !formData.healthCheckupId ||
        !formData.requestDate
      ) {
        notify.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      try {
        setIsSubmitting(true);
        await FecthCreateConselingSchedule(formData);
        notify.success("Đặt lịch tư vấn thành công");
        setShowConsultForm(null);
        clearForm();
      } catch (error) {
        notify.error("Đặt lịch tư vấn thất bại");
        setError(error as string);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  const clearForm = useCallback(() => {
    setFormData({
      studentId: "",
      healthCheckupId: "",
      note: "",
      requestDate: "",
    });
  }, []);

  const handleOpenConsultForm = useCallback(
    (item: MedicalHealthCheckupRecord) => {
      setFormData({
        studentId: item.studentId || "",
        healthCheckupId: item.healthCheckUpId || "",
        note: "",
        requestDate: "",
      });
      setShowConsultForm(healthCheckup.indexOf(item));
    },
    [healthCheckup]
  );

  const fetchHealthCheckup = useCallback(async () => {
    try {
      const data = await FecthHealthCheckup();
      setHealthCheckup(data);
    } catch (error) {
      setError(error as string);
      notify.error("Không thể tải dữ liệu hồ sơ sức khỏe");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  useEffect(() => {
    let filtered = [...healthCheckup];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (record) =>
          record.studentName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (record.nurseName || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.recordDate).getTime();
      const dateB = new Date(b.recordDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredRecords(filtered);
  }, [healthCheckup, searchQuery, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  useEffect(() => {
    fetchHealthCheckup();
  }, [fetchHealthCheckup]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Quản lý hồ sơ sức khỏe"
          icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />}
        />
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3 mb-6">
          <LightbulbIcon className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-700">
            Nhấn vào biểu tượng{" "}
            <CalendarIcon className="w-4 h-4 inline-block mx-1" /> để đặt lịch
            tư vấn
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên học sinh hoặc y tá..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSort}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <span>Sắp xếp theo ngày</span>
            {sortOrder === "asc" ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedRecords.map((item, index) => (
            <div
              key={item.healthCheckUpId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() =>
                  setOpenItemIndex(openItemIndex === index ? null : index)
                }
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.studentName}
                    </h2>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Y tá: {item.nurseName}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Ngày: {customFormatDateOnly(item.recordDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenConsultForm(item);
                      }}
                      className="group relative p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Đặt lịch tư vấn"
                    >
                      <CalendarIcon className="w-5 h-5" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Đặt lịch tư vấn
                      </span>
                    </button>
                    {openItemIndex === index ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              {openItemIndex === index && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Thị lực
                      </Label>
                      <p className="text-gray-900">{item.vision}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Thính lực
                      </Label>
                      <p className="text-gray-900">{item.hearing}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Răng miệng
                      </Label>
                      <p className="text-gray-900">{item.dental}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        BMI
                      </Label>
                      <p className="text-gray-900">{item.bmi}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú bất thường
                    </Label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {item.abnormalNote}
                    </p>
                  </div>
                </div>
              )}

              <Modal
                isOpen={showConsultForm === index}
                onClose={() => {
                  setShowConsultForm(null);
                  clearForm();
                }}
                showCloseButton={true}
                isFullscreen={false}
                className="max-w-md"
              >
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CalendarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Đặt lịch tư vấn
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Học sinh
                      </Label>
                      <Input
                        type="text"
                        value={item.studentName}
                        disabled
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày tư vấn
                      </Label>
                      <Input
                        type="date"
                        value={customFormatDateOnly(formData.requestDate)}
                        onChange={(e) => {
                          const [year, month, day] = e.target.value
                            .split("-")
                            .map(Number);
                          const newDate = new Date(formData.requestDate);
                          newDate.setFullYear(year, month - 1, day);
                          newDate.setHours(9, 0, 0, 0);
                          setFormData((prev) => ({
                            ...prev,
                            requestDate: customFormatDateForBackend(newDate),
                          }));
                        }}
                        min={customFormatDateOnly(new Date())}
                        className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú
                      </Label>
                      <Input
                        type="text"
                        value={formData.note}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            note: e.target.value,
                          }))
                        }
                        placeholder="Nhập ghi chú (nếu có)"
                        className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setShowConsultForm(null);
                        clearForm();
                      }}
                      className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "Đang xử lý..." : "Đặt lịch"}
                    </button>
                  </div>
                </form>
              </Modal>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
