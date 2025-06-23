import { useEffect, useState, useMemo, useCallback } from "react";
import {
  FecthConselingSchedules,
  FecthMedicalHealthCheckupRecordAbnormal,
} from "@/services/MedicalRecordService";
import { MedicalHealthCheckupRecord } from "@/types/MedicalRecord";
import PageHeader from "@/components/ui/PageHeader";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Modal } from "@/components/ui/modal";
import { FecthCreateConselingSchedule } from "@/services/HealthProfileService";
import { ConselingSchedules } from "@/types/ConselingSchedules";
import { ConselingSchedulesAND } from "@/types/ConselingSchedules";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/InputField";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { DateUtils } from "@/utils/DateUtils";
import DatePicker from "@/components/ui/form/DateField";
import { showToast } from "@/components/ui/Toast";

export default function ConselingScheduleAbnormal() {
  const [abnormalStudents, setAbnormalStudents] = useState<
    MedicalHealthCheckupRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<MedicalHealthCheckupRecord | null>(null);
  const [formData, setFormData] = useState<ConselingSchedules>({
    studentId: "",
    healthCheckupId: "",
    note: "",
    requestedDate: "",
  });
  const [consultDate, setConsultDate] = useState<string>("");
  const [consultTime, setConsultTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentStudents, setSentStudents] = useState<ConselingSchedulesAND[]>([]);

  const fetchAbnormalStudents = async () => {
    try {
      const data = await FecthMedicalHealthCheckupRecordAbnormal();
      setAbnormalStudents(data);
    } catch (err) {
      setError("Lỗi khi lấy danh sách học sinh bất thường");
    } finally {
      setIsLoading(false);
    }
  };

  const AbnormalStudentsAppointmentSent = async () => {
    try {
      const data = await FecthConselingSchedules();
      setSentStudents(data);
    } catch (err) {
      setError("Lỗi khi lấy danh sách học sinh đã gửi tư vấn");
    }
  };

  // Search + Pagination + Date filter
  const filteredStudents = useMemo(() => {
    return abnormalStudents.filter((student) => {
      // Loại bỏ học sinh đã gửi tư vấn (trùng studentId và healthCheckUpId)
      const isSent = sentStudents.some(
        (sent) =>
          sent.studentId === student.studentId &&
          sent.healthCheckupId === student.healthCheckUpId
      );
      if (isSent) return false;
      const matchName = student.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchDate = searchDate
        ? student.recordDate.startsWith(searchDate)
        : true;
      return matchName && matchDate;
    });
  }, [abnormalStudents, sentStudents, searchTerm, searchDate]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchAbnormalStudents();
    AbnormalStudentsAppointmentSent();
  }, []);

  // Modal handlers
  const openConsultModal = (student: MedicalHealthCheckupRecord) => {
    setSelectedStudent(student);
    setFormData({
      studentId: student.studentId,
      healthCheckupId: student.healthCheckUpId || "",
      note: "",
      requestedDate: "",
    });
    setConsultDate("");
    setConsultTime("");
    setIsModalOpen(true);
  };

  const closeConsultModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFormData({
      studentId: "",
      healthCheckupId: "",
      note: "",
      requestedDate: "",
    });
    setConsultDate("");
    setConsultTime("");
  };

  // Submit tư vấn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Combine date and time
    let requestDate = "";
    if (consultDate && consultTime) {
      requestDate = `${consultDate}T${consultTime}`;
    }
    if (!formData.studentId || !formData.healthCheckupId || !requestDate) {
      showToast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setIsSubmitting(true);
    try {
      console.log(formData);
      console.log(requestDate);
      const data = {
        studentId: formData.studentId,
        healthCheckupId: formData.healthCheckupId,
        note: formData.note,
        requestedDate: requestDate,
      } as ConselingSchedules;
      await FecthCreateConselingSchedule(data);
      showToast.success("Đặt lịch tư vấn thành công!");
      await AbnormalStudentsAppointmentSent();
      closeConsultModal();
    } catch (err) {
      showToast.error("Đặt lịch tư vấn thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setSearchDate("");
    setCurrentPage(1);
  };

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
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-0 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Danh sách học sinh có kết quả khám sức khỏe bất thường"
          description="Gửi thông báo cho phụ huynh về trình trạng sức khỏe bất thường của học sinh"
          icon={<ExclamationTriangleIcon className="w-8 h-8 text-red-600" />}
        />
        {/* Filter/Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Bộ lọc tìm kiếm
              </h2>
              {(searchTerm || searchDate) && (
                <Button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="search">Tìm kiếm</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    id="search"
                    placeholder="Tìm kiếm theo tên học sinh..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
                  />
                  {searchTerm && (
                    <Button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="date">Ngày khám</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="date"
                    id="date"
                    value={searchDate}
                    onChange={(e) => {
                      setSearchDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
                  />
                  {searchDate && (
                    <Button
                      onClick={() => setSearchDate("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {(searchTerm || searchDate) && (
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
                  {searchTerm && searchDate && " và "}
                  {searchDate && (
                    <span className="font-medium">ngày {searchDate}</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Danh sách */}
        {paginatedStudents.length === 0 ? (
          <div className="mt-8 p-6 bg-white rounded-lg shadow text-center text-gray-500">
            Không có học sinh nào có kết quả bất thường.
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedStudents.map((student) => (
                <div
                  key={student.healthCheckUpId || student.studentId}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col gap-2 hover:shadow-xl transition-all duration-200 group relative"
                >
                  <div
                    className="font-semibold text-lg text-red-700 truncate"
                    title={student.studentName}
                  >
                    {student.studentName}
                  </div>
                  <div
                    className="text-gray-700 text-sm truncate"
                    title={student.abnormalNote}
                  >
                    <span className="font-medium">Ghi chú bất thường:</span>{" "}
                    {student.abnormalNote || "Không có"}
                  </div>
                  <div className="text-gray-700 text-sm">
                    <span className="font-medium">Ngày khám:</span>{" "}
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {student.recordDate}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                      BMI: {student.bmi}
                    </span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                      Thị lực: {student.vision}
                    </span>
                    <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs">
                      Thính lực: {student.hearing}
                    </span>
                    <span className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-xs">
                      Răng miệng: {student.dental}
                    </span>
                  </div>
                  <Button
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow group-hover:scale-105"
                    onClick={() => openConsultModal(student)}
                  >
                    Tư vấn
                  </Button>
                  <div className="absolute top-2 right-2 text-xs text-gray-400">
                    #{student.studentId.slice(-4)}
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination tổng cuối trang */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
                <div className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredStudents.length
                    )}
                  </span>{" "}
                  của{" "}
                  <span className="font-medium">{filteredStudents.length}</span>{" "}
                  kết quả
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Hiển thị</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                    </select>
                    <span className="text-sm text-gray-700">mục</span>
                  </div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <Button
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
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === page
                              ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          }`}
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
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
                    </Button>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Modal tư vấn */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeConsultModal}
        showCloseButton={true}
        isFullscreen={false}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Tư vấn cho học sinh
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Học sinh
              </Label>
              <div className="text-gray-900 font-medium">
                {selectedStudent?.studentName}
              </div>
            </div>
            <div>
              <Label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="note"
              >
                Ghi chú tư vấn
              </Label>
              <textarea
                id="note"
                className="w-full h-32 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                name="note"
                placeholder="Nhập mô tả về thuốc"
                value={formData.note}
                onChange={handleTextAreaChange}
              />
            </div>
            <div className="flex gap-5 justify-between">
              <div>
                <DatePicker
                  id="date-picker"
                  minDate={DateUtils.customFormatDateOnly(new Date())}
                  maxDate="9999-12-31"
                  label="Ngày tư vấn"
                  placeholder="Select a date"
                  defaultDate={consultDate ? new Date(consultDate) : undefined}
                  onChange={(dates, currentDateString) => {
                    console.log(dates);
                    setConsultDate(currentDateString);
                  }}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian tư vấn
                </Label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={consultTime}
                  onChange={(e) => setConsultTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={closeConsultModal}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Đặt lịch tư vấn"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
