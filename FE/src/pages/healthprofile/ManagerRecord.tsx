import { FecthHealthCheckup } from "@/services/HealthProfileService";
import { MedicalHealthCheckupRecord } from "@/types/MedicalRecord";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Modal } from "@/components/ui/modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DateUtils } from "@/utils/DateUtils";
import Input from "@/components/ui/form/InputField";
import PageHeader from "@/components/ui/PageHeader";
import { LightbulbIcon } from "lucide-react";
import { UpdateActivityConsentSchedules } from "@/services/ActiviceMedicalEvent";
import { FecthConselingSchedulesByParent } from "@/services/MedicalRecordService";
import { ConselingSchedulesAND } from "@/types/ConselingSchedules";
import { Button } from "@/components/ui/button";

export default function ManagerRecord() {
  const [healthCheckup, setHealthCheckup] = useState<
    MedicalHealthCheckupRecord[]
  >([]);
  const [filteredRecords, setFilteredRecords] = useState<
    MedicalHealthCheckupRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItemIndex, setOpenItemId] = useState<string | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conselingSchedules, setConselingSchedules] = useState<
    ConselingSchedulesAND[]
  >([]);
  const [selectedConseling, setSelectedConseling] =
    useState<ConselingSchedulesAND | null>(null);

  // Check if student has abnormalities
  const hasAbnormalities = (record: MedicalHealthCheckupRecord) => {
    return record.checkingStatus === "Abnormal";
  };

  // Toast utility function
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    const toastOptions = {
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (type) {
      case "success":
        toast.success(message, toastOptions);
        break;
      case "error":
        toast.error(message, toastOptions);
        break;
      case "info":
        toast.info(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  };

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [checkups, schedules] = await Promise.all([
        FecthHealthCheckup(),
        FecthConselingSchedulesByParent(),
      ]);
      setHealthCheckup(checkups);
      setConselingSchedules(schedules);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      showToast("Lỗi khi tải dữ liệu", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsConsultModalOpen(false);
    setSelectedConseling(null);
  }, []);

  // Logic: Khi xác nhận/từ chối, luôn gửi conselingScheduleId lấy từ selectedConseling.id
  const handleSubmit = useCallback(
    async (status: string) => {
      const actionText = status === "Approved" ? "xác nhận" : "từ chối";
      const userConfirmed = window.confirm(
        `Bạn có chắc chắn muốn ${actionText} lịch tư vấn này không?`
      );

      if (!userConfirmed) {
        return;
      }

      if (!selectedConseling?.id) {
        showToast("Không tìm thấy lịch tư vấn phù hợp!", "error");
        return;
      }
      try {
        setIsSubmitting(true);
        await UpdateActivityConsentSchedules({
          conselingScheduleId: selectedConseling.id,
          status,
        });
        showToast(
          status === "Approved"
            ? "Xác nhận tư vấn thành công"
            : "Từ chối tư vấn thành công",
          "success"
        );
        handleCloseModal();
        fetchAllData();
      } catch (error) {
        showToast("Xác nhận tư vấn thất bại", "error");
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedConseling, fetchAllData, handleCloseModal] // Depend vào selectedConseling!
  );

  // Mở modal và lấy thông tin tư vấn ứng với healthCheckUpId
  const handleOpenConsultForm = useCallback(
    (schedule: ConselingSchedulesAND) => {
      setSelectedConseling(schedule);
      setIsConsultModalOpen(true);
    },
    []
  );

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
    fetchAllData();
  }, [fetchAllData]);

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
          description="Quản lý sức khỏe học sinh sau khi thực hiện sự kiện kiểm tra sức khỏe ở trường và xác nhận lịch tư vấn cho sức khỏe học sinh bất thường"
          icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />}
        />
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3 mb-6">
          <LightbulbIcon className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-700">
            Nhấn vào mục để xác nhận
            tư vấn (nếu có)
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
          <Button
            onClick={handleSort}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <span>Sắp xếp theo ngày</span>
            {sortOrder === "asc" ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
          style={{ alignItems: "start" }}
        >
          {paginatedRecords.map((item) => {
            const schedule = conselingSchedules.find(
              (c) => c.healthCheckupId === item.healthCheckUpId
            );
            return (
              <div
                key={item.healthCheckUpId}
                className={`relative bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md ${hasAbnormalities(item)
                    ? "border-orange-200 ring-1 ring-orange-100"
                    : "border-gray-200"
                  }`}
              >
                {/* Status Indicators */}
                <div className="absolute top-[1rem] right-[13%] flex flex-col items-end gap-[2.3rem] z-10">
                  {hasAbnormalities(item) && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-200">
                      <ExclamationTriangleIcon className="w-3 h-3" />
                      <span>Bất thường</span>
                    </div>
                  )}
                  {schedule && (
                    <>
                      {schedule.status === "Pending" && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                          <CalendarIcon className="w-3 h-3" />
                          <span>Chờ xác nhận</span>
                        </div>
                      )}
                      {schedule.status === "Approved" && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                          <CheckCircleIcon className="w-3 h-3" />
                          <span>Đã xác nhận</span>
                        </div>
                      )}
                      {schedule.status === "Rejected" && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200">
                          <XCircleIcon className="w-3 h-3" />
                          <span>Đã từ chối</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div
                  className="p-4 cursor-pointer relative"
                  onClick={() =>
                    setOpenItemId(
                      openItemIndex === item.healthCheckUpId
                        ? null
                        : item.healthCheckUpId
                    )
                  }
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.studentName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Ngày khám:{" "}
                        {DateUtils.customFormatDateOnly(item.recordDate)}
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="font-medium">Y tá:</span>
                        <span className="ml-2 truncate">{item.nurseName}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-gray-400">
                      {openItemIndex === item.healthCheckUpId ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {openItemIndex === item.healthCheckUpId && (
                  <div className="border-t border-gray-100 bg-gray-50/50">
                    <div className="p-5 space-y-4">
                      {schedule && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenConsultForm(schedule);
                          }}
                          title={
                            schedule.status === "Pending"
                              ? "Có lịch tư vấn chờ xác nhận"
                              : "Xem lịch tư vấn"
                          }
                          className={`group w-full flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 ${schedule.status === "Pending"
                              ? "text-amber-700 bg-amber-100 hover:bg-amber-200 ring-amber-300 shadow-amber-200"
                              : "text-blue-600 bg-blue-50 hover:bg-blue-100 ring-blue-300"
                            }`}
                        >
                          <CalendarIcon className="w-5 h-5" />
                          <span className="font-medium text-sm">
                            {schedule.status === "Pending"
                              ? "Xác nhận tư vấn"
                              : "Xem lịch tư vấn"}
                          </span>
                          {schedule.status === "Pending" && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse border-2 border-white"></span>
                          )}
                        </Button>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Thị lực
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.vision}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Thính lực
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.hearing}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Răng miệng
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.dental}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            BMI
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.bmi}
                          </div>
                        </div>
                      </div>

                      {hasAbnormalities(item) && (
                        <div
                          className={`bg-white p-4 rounded-lg border-l-4 ${hasAbnormalities(item)
                              ? "border-orange-400 bg-orange-50/50"
                              : "border-gray-200"
                            }`}
                        >
                          <div className="flex items-start gap-2">
                            {hasAbnormalities(item) && (
                              <ExclamationTriangleIcon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Ghi chú bất thường
                              </div>
                              <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {item.abnormalNote}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal for consultation confirmation */}
        <Modal
          isOpen={isConsultModalOpen}
          onClose={handleCloseModal}
          showCloseButton={true}
          isFullscreen={false}
          className="max-w-md"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Xác nhận tư vấn
              </h3>
            </div>
            {selectedConseling ? (
              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Học sinh</p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {selectedConseling.studentName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phụ huynh</p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {selectedConseling.parentName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày hẹn</p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {DateUtils.customFormatDate(selectedConseling.meetingDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Ghi chú của nhà trường
                  </p>
                  <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedConseling.note || "Không có ghi chú."}
                  </p>
                </div>
              </div>
            ) : (
              <div>Không tìm thấy thông tin lịch tư vấn.</div>
            )}
            <div className="flex justify-end gap-3 mt-8">
              {selectedConseling?.status === "Pending" ? (
                <>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit("Rejected")}
                    className="px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Từ chối"}
                  </Button>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit("Approved")}
                    className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Quay lại
                </Button>
              )}
            </div>
          </div>
        </Modal>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
