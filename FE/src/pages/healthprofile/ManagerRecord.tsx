import { FecthHealthCheckup, FecthVaccinationRecords } from "@/services/HealthProfileService";
import { MedicalHealthCheckupRecord, MedicalVaccinationRecord } from "@/types/MedicalRecord";
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
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Modal } from "@/components/ui/modal";
import { showToast } from "@/components/ui/Toast";
import { DateUtils } from "@/utils/DateUtils";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
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
  const [vaccinationRecords, setVaccinationRecords] = useState<MedicalVaccinationRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<
    (MedicalHealthCheckupRecord & { recordType: 'healthCheckup' } | MedicalVaccinationRecord & { recordType: 'vaccination' })[]
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

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAbnormalStatus, setSelectedAbnormalStatus] =
    useState<string>("all");
  const [selectedView, setSelectedView] = useState<
    "healthCheckup" | "vaccination"
  >("healthCheckup");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Status options
  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "Pending", label: "Chờ xác nhận" },
    { value: "Approved", label: "Đã xác nhận" },
    { value: "Rejected", label: "Đã từ chối" },
  ];

  const abnormalStatusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "normal", label: "Bình thường" },
    { value: "abnormal", label: "Bất thường" },
  ];

  const viewOptions = [
    { value: "healthCheckup", label: "Hồ sơ khám sức khỏe" },
    { value: "vaccination", label: "Hồ sơ tiêm chủng" },
  ];

  // Check if student has abnormalities
  const hasAbnormalities = (record: MedicalHealthCheckupRecord) => {
    return record.checkingStatus === "Abnormal";
  };

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [checkups, schedules, vaccinations] = await Promise.all([
        FecthHealthCheckup(),
        FecthConselingSchedulesByParent(),
        FecthVaccinationRecords(),
      ]);
      setHealthCheckup(checkups);
      setConselingSchedules(schedules);
      setVaccinationRecords(vaccinations || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      showToast.error("Lỗi khi tải dữ liệu");
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
        showToast.error("Không tìm thấy lịch tư vấn phù hợp!");
        return;
      }
      try {
        setIsSubmitting(true);
        await UpdateActivityConsentSchedules({
          conselingScheduleId: selectedConseling.id,
          status,
        });
        showToast.success(
          status === "Approved"
            ? "Xác nhận tư vấn thành công"
            : "Từ chối tư vấn thành công"
        );
        handleCloseModal();
        fetchAllData();
      } catch (error) {
        showToast.error("Xác nhận tư vấn thất bại");
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

  const handleSort = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedAbnormalStatus("all");
    setSelectedView("healthCheckup");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  }, []);

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    selectedStatus !== "all" ||
    selectedAbnormalStatus !== "all" ||
    startDate ||
    endDate;

  const handleViewChange = (value: string) => {
    setSelectedView(value as "healthCheckup" | "vaccination");
    setCurrentPage(1);
  };

  useEffect(() => {
    // Combine health checkup and vaccination records with type indicators
    const combinedRecords = [
      ...healthCheckup.map(record => ({ ...record, recordType: 'healthCheckup' as const })),
      ...vaccinationRecords.map(record => ({ ...record, recordType: 'vaccination' as const }))
    ];

    let filtered = [...combinedRecords];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (record) => {
          if (record.recordType === 'healthCheckup') {
            return record.studentName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
              (record.nurseName || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
          } else {
            return record.studentName
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          }
        }
      );
    }

    // Apply status filter (only for health checkup records with consultation schedules)
    if (selectedStatus !== "all") {
      filtered = filtered.filter((record) => {
        if (record.recordType === 'healthCheckup') {
          const schedule = conselingSchedules.find(
            (c) => c.healthCheckupId === record.healthCheckUpId
          );
          return schedule?.status === selectedStatus;
        }
        return true; // Vaccination records don't have consultation status
      });
    }

    // Apply abnormal status filter (only for health checkup records)
    if (selectedAbnormalStatus !== "all") {
      filtered = filtered.filter((record) => {
        if (record.recordType === 'healthCheckup') {
          const isAbnormal = hasAbnormalities(record);
          return selectedAbnormalStatus === "abnormal" ? isAbnormal : !isAbnormal;
        }
        return true; // Vaccination records don't have abnormal status
      });
    }

    // Apply record type filter
    filtered = filtered.filter((record) => record.recordType === selectedView);

    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.recordType === 'healthCheckup' ? record.recordDate : record.vaccinatedAt);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.recordType === 'healthCheckup' ? record.recordDate : record.vaccinatedAt);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate <= end;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.recordType === 'healthCheckup' ? a.recordDate : a.vaccinatedAt).getTime();
      const dateB = new Date(b.recordType === 'healthCheckup' ? b.recordDate : b.vaccinatedAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredRecords(filtered);
  }, [
    healthCheckup,
    vaccinationRecords,
    conselingSchedules,
    searchQuery,
    selectedStatus,
    selectedAbnormalStatus,
    selectedView,
    startDate,
    endDate,
    sortOrder,
  ]);

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
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Quản lý hồ sơ sức khỏe"
          description="Quản lý sức khỏe học sinh sau khi thực hiện sự kiện kiểm tra sức khỏe ở trường và xác nhận lịch tư vấn cho sức khỏe học sinh bất thường"
          icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />}
        />
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3 mb-2">
          <LightbulbIcon className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-700">
            Nhấn vào mục để xác nhận tư vấn (nếu có)
          </p>
        </div>

        {/* View Type Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium text-gray-700">
                  Loại hồ sơ
                </Label>
                <Select
                  options={viewOptions}
                  defaultValue={selectedView}
                  placeholder="Chọn một tùy chọn"
                  onChange={handleViewChange}
                  className="dark:bg-dark-900 text-sm w-[200px] text-gray-500 border-gray-200 placeholder-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-3">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Bộ lọc tìm kiếm
              </h2>

              {/* Sort Control */}
              <div className="flex flex-wrap items-center gap-3">
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
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <Label htmlFor="search">Tìm kiếm</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    placeholder="Tìm kiếm theo tên học sinh hoặc y tá..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="status">Trạng thái tư vấn</Label>
                <Select
                  options={statusOptions}
                  defaultValue={selectedStatus}
                  onChange={(value) => {
                    setSelectedStatus(value);
                    setCurrentPage(1);
                  }}
                  className="w-full"
                  placeholder="Chọn trạng thái"
                />
              </div>
              <div>
                <Label htmlFor="abnormalStatus">Tình trạng sức khỏe</Label>
                <Select
                  options={abnormalStatusOptions}
                  defaultValue={selectedAbnormalStatus}
                  onChange={(value) => {
                    setSelectedAbnormalStatus(value);
                    setCurrentPage(1);
                  }}
                  className="w-full"
                  placeholder="Chọn tình trạng"
                />
              </div>
              <div>
                <div>
                  <Label htmlFor="startDate">Từ ngày</Label>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Đến ngày</Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            {hasActiveFilters && (
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
                  {searchQuery && (
                    <span className="font-medium">"{searchQuery}"</span>
                  )}
                  {searchQuery &&
                    (selectedStatus !== "all" ||
                      selectedAbnormalStatus !== "all" ||
                      startDate ||
                      endDate) &&
                    " và "}
                  {selectedStatus !== "all" && (
                    <span className="font-medium">
                      {selectedStatus === "Pending"
                        ? "chờ xác nhận"
                        : selectedStatus === "Approved"
                          ? "đã xác nhận"
                          : "đã từ chối"}
                    </span>
                  )}
                  {selectedStatus !== "all" &&
                    (selectedAbnormalStatus !== "all" ||
                      startDate ||
                      endDate) &&
                    " và "}
                  {selectedAbnormalStatus !== "all" && (
                    <span className="font-medium">
                      {selectedAbnormalStatus === "abnormal"
                        ? "bất thường"
                        : "bình thường"}
                    </span>
                  )}
                  {selectedAbnormalStatus !== "all" &&
                    (startDate || endDate) &&
                    " và "}
                  {(startDate || endDate) && (
                    <span className="font-medium">
                      {startDate && endDate
                        ? `từ ${DateUtils.customFormatDateOnly(
                          startDate
                        )} đến ${DateUtils.customFormatDateOnly(endDate)}`
                        : startDate
                          ? `từ ${DateUtils.customFormatDateOnly(startDate)}`
                          : `đến ${DateUtils.customFormatDateOnly(endDate)}`}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
          style={{ alignItems: "start" }}
        >
          {paginatedRecords.map((item) => {
            // Type guard to check if it's a health checkup record
            const isHealthCheckup = 'healthCheckUpId' in item;

            if (isHealthCheckup) {
              // Render health checkup record
              const healthCheckupItem = item as MedicalHealthCheckupRecord & { recordType: 'healthCheckup' };
              const schedule = conselingSchedules.find(
                (c) => c.healthCheckupId === healthCheckupItem.healthCheckUpId
              );
              return (
                <div
                  key={healthCheckupItem.healthCheckUpId}
                  className={`relative bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md ${hasAbnormalities(healthCheckupItem)
                    ? "border-orange-200 ring-1 ring-orange-100"
                    : "border-gray-200"
                    }`}
                >
                  {/* Status Indicators */}
                  <div className="absolute top-[1rem] right-[13%] flex flex-col items-end gap-[2.3rem] z-10">
                    {hasAbnormalities(healthCheckupItem) && (
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
                        openItemIndex === healthCheckupItem.healthCheckUpId
                          ? null
                          : healthCheckupItem.healthCheckUpId
                      )
                    }
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {healthCheckupItem.studentName}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Ngày khám:{" "}
                          {DateUtils.customFormatDateOnly(healthCheckupItem.recordDate)}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="font-medium">Y tá:</span>
                          <span className="ml-2 truncate">{healthCheckupItem.nurseName}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-gray-400">
                        {openItemIndex === healthCheckupItem.healthCheckUpId ? (
                          <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {openItemIndex === healthCheckupItem.healthCheckUpId && (
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
                              {healthCheckupItem.vision}
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Thính lực
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {healthCheckupItem.hearing}
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              Răng miệng
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {healthCheckupItem.dental}
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              BMI
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {healthCheckupItem.bmi}
                            </div>
                          </div>
                        </div>

                        {hasAbnormalities(healthCheckupItem) && (
                          <div
                            className={`bg-white p-4 rounded-lg border-l-4 ${hasAbnormalities(healthCheckupItem)
                              ? "border-orange-400 bg-orange-50/50"
                              : "border-gray-200"
                              }`}
                          >
                            <div className="flex items-start gap-2">
                              {hasAbnormalities(healthCheckupItem) && (
                                <ExclamationTriangleIcon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                  Ghi chú bất thường
                                </div>
                                <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                  {healthCheckupItem.abnormalNote}
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
            } else {
              // Render vaccination record
              const vaccinationItem = item as MedicalVaccinationRecord & { recordType: 'vaccination' };
              return (
                <div
                  key={vaccinationItem.id}
                  className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {vaccinationItem.studentName}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Ngày tiêm:{" "}
                          {DateUtils.customFormatDateOnly(vaccinationItem.time)}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="font-medium">Vaccine:</span>
                          <span className="ml-2 truncate">{vaccinationItem.vaccineName}</span>
                        </div>
                      </div>
                    </div>

                    {vaccinationItem.resultNote && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Ghi chú
                        </div>
                        <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {vaccinationItem.resultNote}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
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
