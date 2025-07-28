import {
  FecthHealthCheckup,
  FecthVaccinationRecords,
} from "@/services/HealthProfileService";
import {
  MedicalHealthCheckupRecord,
  MedicalVaccinationRecord,
} from "@/types/MedicalRecord";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
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
  const [vaccinationRecords, setVaccinationRecords] = useState<
    MedicalVaccinationRecord[]
  >([]);
  const [filteredRecords, setFilteredRecords] = useState<
    (
      | (MedicalHealthCheckupRecord & { recordType: "healthCheckup" })
      | (MedicalVaccinationRecord & { recordType: "vaccination" })
    )[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conselingSchedules, setConselingSchedules] = useState<
    ConselingSchedulesAND[]
  >([]);
  const [selectedConseling, setSelectedConseling] =
    useState<ConselingSchedulesAND | null>(null);
  const [parentRejectNote, setParentRejectNote] = useState<string>("");
  const [showRejectNoteInput, setShowRejectNoteInput] =
    useState<boolean>(false);

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
    setParentRejectNote("");
    setShowRejectNoteInput(false);
  }, []);

  // Logic: Khi xác nhận/từ chối, luôn gửi conselingScheduleId lấy từ selectedConseling.id
  const handleSubmit = useCallback(
    async (status: string) => {
      if (!selectedConseling?.id) {
        showToast.error("Không tìm thấy lịch tư vấn phù hợp!");
        return;
      }

      // Validate reject note if rejecting
      if (status === "Rejected" && !parentRejectNote.trim()) {
        showToast.error("Vui lòng nhập lý do từ chối!");
        return;
      }

      try {
        setIsSubmitting(true);
        console.log(selectedConseling.id);
        await UpdateActivityConsentSchedules({
          conselingScheduleId: selectedConseling.id,
          status,
          parentRejectNote: status === "Rejected" ? parentRejectNote : "",
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
    [selectedConseling, parentRejectNote, fetchAllData, handleCloseModal] // Depend vào selectedConseling!
  );

  // Mở modal và lấy thông tin tư vấn ứng với healthCheckUpId
  const handleOpenConsultForm = useCallback(
    (schedule: ConselingSchedulesAND) => {
      setSelectedConseling(schedule);
      setIsConsultModalOpen(true);
      setShowRejectNoteInput(false);
      setParentRejectNote("");
    },
    []
  );

  // Handle reject button click
  const handleRejectClick = () => {
    setShowRejectNoteInput(true);
  };

  // Handle cancel reject
  const handleCancelReject = () => {
    setShowRejectNoteInput(false);
    setParentRejectNote("");
  };

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
      ...healthCheckup.map((record) => ({
        ...record,
        recordType: "healthCheckup" as const,
      })),
      ...vaccinationRecords.map((record) => ({
        ...record,
        recordType: "vaccination" as const,
      })),
    ];

    let filtered = [...combinedRecords];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((record) => {
        if (record.recordType === "healthCheckup") {
          return (
            record.studentName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (record.nurseName || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        } else {
          return record.studentName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
      });
    }

    // Apply status filter (only for health checkup records with consultation schedules)
    if (selectedStatus !== "all") {
      filtered = filtered.filter((record) => {
        if (record.recordType === "healthCheckup") {
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
        if (record.recordType === "healthCheckup") {
          const isAbnormal = hasAbnormalities(record);
          return selectedAbnormalStatus === "abnormal"
            ? isAbnormal
            : !isAbnormal;
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
        const recordDate = new Date(
          record.recordType === "healthCheckup"
            ? record.recordDate
            : record.vaccinatedAt
        );
        recordDate.setHours(0, 0, 0, 0);
        return recordDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(
          record.recordType === "healthCheckup"
            ? record.recordDate
            : record.vaccinatedAt
        );
        recordDate.setHours(0, 0, 0, 0);
        return recordDate <= end;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(
        a.recordType === "healthCheckup" ? a.recordDate : a.vaccinatedAt
      ).getTime();
      const dateB = new Date(
        b.recordType === "healthCheckup" ? b.recordDate : b.vaccinatedAt
      ).getTime();
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedRecords.map((item) => {
            // Type guard to check if it's a health checkup record
            const isHealthCheckup = "healthCheckUpId" in item;

            if (isHealthCheckup) {
              // Render health checkup record
              const healthCheckupItem = item as MedicalHealthCheckupRecord & {
                recordType: "healthCheckup";
              };
              const schedule = conselingSchedules.find(
                (c) => c.healthCheckupId === healthCheckupItem.healthCheckUpId
              );
              return (
                <div
                  key={healthCheckupItem.healthCheckUpId}
                  className={`relative bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md ${
                    hasAbnormalities(healthCheckupItem)
                      ? "border-orange-200"
                      : schedule?.status === "Pending"
                      ? "border-amber-200"
                      : "border-gray-200"
                  }`}
                >
                  <div className="p-6">
                    {/* Student Header */}
                    <div className="text-center mb-6">
                      <div className="relative inline-block mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                          <div className="text-2xl font-bold text-gray-700">
                            {healthCheckupItem.studentName
                              .trim()
                              .split(" ")
                              .pop()
                              ?.charAt(0)}
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-200">
                          {hasAbnormalities(healthCheckupItem) ? (
                            <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
                          ) : schedule?.status === "Pending" ? (
                            <CalendarIcon className="w-4 h-4 text-amber-500" />
                          ) : (
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        {healthCheckupItem.studentName}
                      </h2>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span>
                            {DateUtils.customFormatDateOnly(
                              healthCheckupItem.recordDate
                            )}
                          </span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <span>{healthCheckupItem.nurseName}</span>
                        </div>
                      </div>
                      {hasAbnormalities(healthCheckupItem) && (
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-orange-600 font-medium">
                            Cần chú ý: Có ghi chú bất thường
                          </span>
                        </div>
                      )}
                      {schedule?.status === "Pending" && (
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <CalendarIcon className="w-4 h-4 text-amber-500" />
                          <span className="text-sm text-amber-600 font-medium">
                            Cần xác nhận tư vấn
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Health Information Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {/* Vision */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Thị lực
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {healthCheckupItem.vision || "N/A"}
                        </div>
                      </div>

                      {/* Hearing */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Thính lực
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {healthCheckupItem.hearing || "N/A"}
                        </div>
                      </div>

                      {/* Dental */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Răng miệng
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {healthCheckupItem.dental || "N/A"}
                        </div>
                      </div>

                      {/* BMI */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            BMI
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {healthCheckupItem.bmi || "N/A"}
                        </div>
                      </div>

                      {/* Height */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Chiều cao
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {healthCheckupItem.height
                            ? `${healthCheckupItem.height} cm`
                            : "N/A"}
                        </div>
                      </div>

                      {/* Weight */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Cân nặng
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {healthCheckupItem.weight
                            ? `${healthCheckupItem.weight} kg`
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Abnormal Notes */}
                    {hasAbnormalities(healthCheckupItem) && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ExclamationTriangleIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Ghi chú bất thường
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">
                          {healthCheckupItem.abnormalNote || "Không có"}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/* Approve/Reject Button - Only show when there's an existing schedule */}
                      {schedule && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenConsultForm(schedule);
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded transition-colors ${
                            schedule.status === "Pending"
                              ? "text-white bg-amber-500 hover:bg-amber-600 border border-amber-500"
                              : schedule.status === "Approved"
                              ? "text-white bg-green-500 hover:bg-green-600 border border-green-500"
                              : "text-white bg-red-500 hover:bg-red-600 border border-red-500"
                          }`}
                        >
                          <CalendarIcon className="w-4 h-4" />
                          {schedule.status === "Pending"
                            ? "Xác nhận tư vấn"
                            : schedule.status === "Approved"
                            ? "Đã xác nhận"
                            : "Đã từ chối"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Render vaccination record
              const vaccinationItem = item as MedicalVaccinationRecord & {
                recordType: "vaccination";
              };
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
                          <span className="ml-2 truncate">
                            {vaccinationItem.vaccineName}
                          </span>
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
          className="max-w-xl w-full"
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
            {/* Reject Note Input */}
            {showRejectNoteInput && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-red-800">
                    Lý do từ chối tư vấn
                  </h4>
                </div>
                <textarea
                  value={parentRejectNote}
                  onChange={(e) => setParentRejectNote(e.target.value)}
                  placeholder="Vui lòng nhập lý do từ chối tư vấn..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-red-600 mt-2">
                  * Lý do từ chối là bắt buộc khi từ chối tư vấn
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              {selectedConseling?.status === "Pending" ? (
                <>
                  {showRejectNoteInput ? (
                    <>
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleCancelReject}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Hủy
                      </Button>
                      <Button
                        type="button"
                        disabled={isSubmitting || !parentRejectNote.trim()}
                        onClick={() => handleSubmit("Rejected")}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Đang xử lý..." : "Xác nhận từ chối"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleRejectClick}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Từ chối
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
                  )}
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
              className="px-4 py-2 text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-black border-gray-200 hover:bg-gray-50"
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
              className="px-4 py-2 bg-white border text-black border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
