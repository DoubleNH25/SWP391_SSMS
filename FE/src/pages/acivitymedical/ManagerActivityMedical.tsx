import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import PageHeader from "@/components/ui/PageHeader";
import { showToast } from "@/components/ui/Toast";
import {
  FecthActivityMedicalEvent,
  UpdateActivityConsentStatus,
} from "@/services/ActiviceMedicalEvent";
import { FecthStudentById, FecthUserById } from "@/services/UserService";
import {
  ActivityMedicalEventDetailViewModel,
  ActivityMedicalEventViewModel,
} from "@/types/ActivityMedicalEvent";
import {
  Check,
  CheckCircle2,
  Clock,
  FileText,
  User,
  Search,
  X,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ManagerActivityMedical() {
  const navigate = useNavigate();
  const [activityMedicalEvent, setActivityMedicalEvent] = useState<
    ActivityMedicalEventViewModel[]
  >([]);
  const [activityMedicalEventDetail, setActivityMedicalEventDetail] =
    useState<ActivityMedicalEventDetailViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { eventId } = useParams<{ eventId: string }>();
  const [decision, setDecision] = useState<boolean | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await FecthActivityMedicalEvent();
      setActivityMedicalEvent(response);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch activity medical events:", error);
      setError("Không thể tải danh sách sự kiện y tế");
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Approved":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const fetchStudentByActivityId = useCallback(async (studentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await FecthStudentById(studentId);
      return response;
    } catch (error) {
      console.error("Failed to fetch student by activity ID:", error);
      return null;
    }
  }, []);

  const fetchUserByActivityId = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await FecthUserById(userId);
      return response;
    } catch (error) {
      console.error("Failed to fetch user by activity ID:", error);
      return null;
    }
  }, []);

  const fetchActivityMedicalEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await FecthActivityMedicalEvent();
      setActivityMedicalEvent(data);

      const eventDetail = data.find((event) => event.id === eventId);
      if (eventDetail) {
        const student = await fetchStudentByActivityId(eventDetail.studentId);
        const user = await fetchUserByActivityId(eventDetail.responsibleUserId);
        if (student) {
          setActivityMedicalEventDetail({
            ...eventDetail,
            student: student,
            responsibleUser: user || null,
          });
        } else {
          setError("Không tìm thấy học sinh");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch activity medical event:", error);
      setError("Không thể tải chi tiết sự kiện y tế");
      setLoading(false);
    }
  }, [eventId, fetchStudentByActivityId, fetchUserByActivityId]);

  useEffect(() => {
    if (eventId) {
      fetchActivityMedicalEvent();
    } else {
      fetchData();
    }
  }, [fetchData, fetchActivityMedicalEvent, eventId]);

  const handleDecision = (approve: boolean) => {
    setDecision(approve);
    setShowConfirmation(true);
  };

  const confirmDecision = async () => {
    if (!activityMedicalEventDetail) return;

    setLoading(true);
    try {
      const status = decision ? "Approved" : "Rejected";
      const statusValue = status === "Approved" ? 1 : 2; // 1 = Approved, 2 = Rejected
      await UpdateActivityConsentStatus(
        activityMedicalEventDetail.id,
        statusValue as 1 | 2
      );

      showToast.success(
        `Đã ${decision ? "chấp nhận" : "từ chối"} tham gia sự kiện thành công!`
      );
      setShowConfirmation(false);
      // Refresh the data
      await fetchActivityMedicalEvent();
      handleBack();
    } catch (error) {
      console.error("Error updating consent status:", error);
      showToast.error(
        "Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard/activity-medical");
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/dashboard/activity-medical/${eventId}`);
  };

  const filteredEvents = activityMedicalEvent.filter((event) => {
    const matchesSearch =
      event.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    const matchesDate =
      !dateFilter ||
      new Date(event.scheduleTime).toDateString() ===
        new Date(dateFilter).toDateString();

    const matchesType =
      typeFilter === "all" ||
      event.activityType.toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesDate && matchesType;
  });

  // Pagination calculations
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, typeFilter]);

  return (
    <div>
      <div className="p-6 min-h-screen">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        )}
        {!loading && !error && eventId && activityMedicalEventDetail ? (
          <div className="">
            <div className="flex items-center gap-3 px-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
            </div>
            <div className="max-w-full mx-auto px-4 py-5">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        activityMedicalEventDetail.status
                      )}`}
                    >
                      {getStatusIcon(activityMedicalEventDetail.status)}
                      {activityMedicalEventDetail.status}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {activityMedicalEventDetail.activityId}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {activityMedicalEventDetail.activityName}
                        </h2>
                        <p className="text-gray-600">
                          {activityMedicalEventDetail.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Loại sự kiện
                            </p>
                            <p className="text-gray-600">
                              {activityMedicalEventDetail.activityType ===
                              "HealthActivity"
                                ? "Khám sức khỏe"
                                : "Tiêm chủng"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Thời gian thực hiện
                            </p>
                            <p className="text-gray-600">
                              {new Date(
                                activityMedicalEventDetail.scheduleTime
                              ).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Người phụ trách
                            </p>
                            <p className="text-gray-600">
                              {activityMedicalEventDetail.responsibleUserName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-4">
                          Thông tin học sinh
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Họ tên:</span>
                            <span className="font-medium text-blue-900">
                              {activityMedicalEventDetail.student?.fullName ||
                                activityMedicalEventDetail.studentName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Mã học sinh:</span>
                            <span className="font-medium text-blue-900">
                              {activityMedicalEventDetail.student
                                ?.studentCode || "Chưa có thông tin"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Ngày sinh:</span>
                            <span className="font-medium text-blue-900">
                              {activityMedicalEventDetail.student?.dateOfBirth
                                ? new Date(
                                    activityMedicalEventDetail.student.dateOfBirth
                                  ).toLocaleDateString("vi-VN")
                                : "Chưa có thông tin"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Giới tính:</span>
                            <span className="font-medium text-blue-900">
                              {activityMedicalEventDetail.student?.gender ===
                              "Male"
                                ? "Nam"
                                : activityMedicalEventDetail.student?.gender ===
                                  "Female"
                                ? "Nữ"
                                : activityMedicalEventDetail.student?.gender ===
                                  "Other"
                                ? "Khác"
                                : "Chưa có thông tin"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Lớp:</span>
                            <span className="font-medium text-blue-900">
                              {activityMedicalEventDetail.student?.studentClass
                                ?.className || "Chưa có thông tin"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Phòng học:</span>
                            <span className="font-medium text-blue-900">
                              {activityMedicalEventDetail.student?.studentClass
                                ?.classRoom || "Chưa có thông tin"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg mt-2">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Thông tin liên hệ
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {activityMedicalEventDetail.responsibleUser?.phone ||
                            "Chưa có thông tin"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {activityMedicalEventDetail.responsibleUser?.email ||
                            "Chưa có thông tin"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t bg-gray-50">
                  {activityMedicalEventDetail.status === "Pending" ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleDecision(false)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-200 text-red-700 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium"
                      >
                        <X className="w-5 h-5" />
                        Không chấp nhận
                      </button>
                      <button
                        onClick={() => handleDecision(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <Check className="w-5 h-5" />
                        Chấp nhận tham gia
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                        {activityMedicalEventDetail.status === "Approved" ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>Đã chấp nhận tham gia</span>
                          </>
                        ) : (
                          <>
                            <X className="w-5 h-5 text-red-600" />
                            <span>Đã từ chối tham gia</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : !loading && !error && !eventId ? (
          <div>
            <PageHeader
              title="Quản lý sự kiện y tế"
              icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
              description="Quản lý các sự kiện y tế trong hệ thống"
            />

            {/* Search and Filter Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Bộ lọc tìm kiếm
                  </h2>
                  {(searchTerm ||
                    statusFilter !== "all" ||
                    dateFilter ||
                    typeFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setDateFilter("");
                        setTypeFilter("all");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tìm kiếm
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên sự kiện hoặc học sinh..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="Pending">Chờ phê duyệt</option>
                      <option value="Approved">Đã phê duyệt</option>
                      <option value="Rejected">Từ chối</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày thực hiện
                    </label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="block w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
                {(searchTerm ||
                  statusFilter !== "all" ||
                  dateFilter ||
                  typeFilter !== "all") && (
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
                      Hiển thị {totalItems} kết quả
                      {searchTerm && (
                        <span>
                          {" "}
                          cho "<span className="font-medium">{searchTerm}</span>
                          "
                        </span>
                      )}
                      {statusFilter !== "all" && (
                        <span>
                          {" "}
                          - <span className="font-medium">{statusFilter}</span>
                        </span>
                      )}
                      {dateFilter && (
                        <span>
                          {" "}
                          -{" "}
                          <span className="font-medium">
                            {new Date(dateFilter).toLocaleDateString("vi-VN")}
                          </span>
                        </span>
                      )}
                      {typeFilter !== "all" && (
                        <span>
                          {" "}
                          - <span className="font-medium">{typeFilter}</span>
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {totalItems === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy sự kiện nào
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedEvents.map((event, index) => (
                      <div
                        key={index}
                        onClick={() => handleEventClick(event.id)}
                        className="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md hover:bg-white transition-all cursor-pointer"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                              {event.activityName}
                            </h3>
                            <Eye className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 text-sm truncate">
                                {event.studentName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 text-sm truncate">
                                {event.activityType === "HealthActivity"
                                  ? "Khám sức khỏe"
                                  : "Tiêm chủng"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 text-sm">
                                {new Date(
                                  event.scheduleTime
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                event.status
                              )}`}
                            >
                              {getStatusIcon(event.status)}
                              {event.status === "Pending"
                                ? "Chờ duyệt"
                                : event.status === "Approved"
                                ? "Đã duyệt"
                                : "Từ chối"}
                            </div>
                            <span className="text-xs text-gray-500 truncate max-w-[80px]">
                              #{event.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <p className="text-sm text-gray-600">
                          Hiển thị{" "}
                          <span className="text-gray-900">
                            {startIndex + 1}
                          </span>{" "}
                          đến{" "}
                          <span className="text-gray-900">
                            {Math.min(endIndex, totalItems)}
                          </span>{" "}
                          trong tổng số{" "}
                          <span className="text-gray-900">{totalItems}</span>{" "}
                          kết quả
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Hiển thị:
                          </span>
                          <select
                            value={itemsPerPage}
                            onChange={(e) => {
                              setItemsPerPage(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          >
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                          </select>
                          <span className="text-sm text-gray-600">mục</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Trước
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
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
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          Sau
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        showCloseButton={true}
        isFullscreen={false}
        className="max-w-md p-8"
      >
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              decision ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {decision ? (
              <Check className="w-8 h-8 text-green-600" />
            ) : (
              <X className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Xác nhận quyết định
          </h3>
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn{" "}
            <strong>{decision ? "chấp nhận" : "từ chối"}</strong> cho con em
            tham gia sự kiện y tế này không?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={confirmDecision}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                decision
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
