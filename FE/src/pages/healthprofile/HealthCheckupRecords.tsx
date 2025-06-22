import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Scale,
  Ear,
  Stethoscope,
  Syringe,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { FecthStudentById } from "@/services/UserService";
import { Student } from "@/types/Student";

export default function HealthCheckupRecords() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedStudents = await FecthStudentById(studentId!);
      if (!fetchedStudents) {
        throw new Error("Student not found");
      }
      setStudent(fetchedStudents);
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("authenticated")
          ? "Vui lòng đăng nhập để xem lịch sử khám sức khỏe."
          : "Không thể lấy dữ liệu. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5)
      return {
        status: "Thiếu cân",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    if (bmi < 25)
      return {
        status: "Bình thường",
        color: "text-green-600",
        bg: "bg-green-50",
      };
    if (bmi < 30)
      return {
        status: "Thừa cân",
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    return { status: "Béo phì", color: "text-red-600", bg: "bg-red-50" };
  };

  // Tính toán phân trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords =
    student?.healthCheckupRecords?.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    ) || [];
  const totalPages = Math.ceil(
    (student?.healthCheckupRecords?.length || 0) / recordsPerPage
  );

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 my-6 ">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Trước
        </Button>
        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(number)}
            className="w-8 h-8 p-0"
          >
            {number}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          Sau
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="max-w-2xl mx-auto text-center p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-red-200"
          >
            <div className="p-3 bg-red-50 rounded-full w-14 h-14 mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-red-600 text-base sm:text-lg font-medium mb-4">
              {error}
            </p>
            {error.includes("authenticated") ? (
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                Đăng nhập
              </button>
            ) : (
              <button
                onClick={fetchData}
                className="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                Thử lại
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Student Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      {student?.fullName}
                    </h2>
                    <div className="flex items-center gap-1 text-gray-500">
                      {student?.gender === "Female" ? (
                        <img
                          src="https://img.icons8.com/?size=100&id=QGwItfaRyLnq&format=png&color=000000"
                          alt="Female"
                          className="w-4 h-4"
                        />
                      ) : (
                        <img
                          src="https://img.icons8.com/?size=100&id=S1TSOmfK8dXg&format=png&color=000000"
                          alt="Male"
                          className="w-4 h-4"
                        />
                      )}
                      <span className="text-sm">
                        {student?.gender === "Female" ? "Nữ" : "Nam"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Mã học sinh:</span>
                      <span>{student?.studentCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Lớp:</span>
                      <span>{student?.studentClass.className}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Ngày sinh:</span>
                      <span>{formatDate(student?.dateOfBirth || "")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Phòng học:</span>
                      <span>{student?.studentClass.classRoom}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Profile Card */}
            {student?.healthProfile && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-500" />
                  Hồ sơ sức khỏe
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="p-2.5 bg-blue-100 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Thị lực
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {student.healthProfile.vision || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="p-2.5 bg-blue-100 rounded-lg">
                      <Ear className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Thính lực
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {student.healthProfile.hearing || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="p-2.5 bg-blue-100 rounded-lg">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Răng miệng
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {student.healthProfile.dental || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="p-2.5 bg-blue-100 rounded-lg">
                      <Scale className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">BMI</p>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-gray-900">
                          {student.healthProfile.bmi || "Chưa có thông tin"}
                        </p>
                        {student.healthProfile.bmi && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              getBMIStatus(student.healthProfile.bmi).bg
                            } ${getBMIStatus(student.healthProfile.bmi).color}`}
                          >
                            {getBMIStatus(student.healthProfile.bmi).status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {student.healthProfile.abnormalNote && (
                  <div className="mt-5 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm font-medium text-yellow-800">
                        Ghi chú bất thường
                      </p>
                    </div>
                    <p className="text-sm text-yellow-700">
                      {student.healthProfile.abnormalNote}
                    </p>
                  </div>
                )}
                {student.healthProfile.vaccinationHistory && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Syringe className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800">
                        Lịch sử tiêm chủng
                      </p>
                    </div>
                    <p className="text-sm text-green-700">
                      {student.healthProfile.vaccinationHistory}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Records List with Pagination */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Lịch sử khám sức khỏe
                  </h3>
                  <span className="text-sm text-gray-500">
                    Hiển thị {indexOfFirstRecord + 1}-
                    {Math.min(
                      indexOfLastRecord,
                      student?.healthCheckupRecords?.length || 0
                    )}{" "}
                    của {student?.healthCheckupRecords?.length || 0} bản ghi
                  </span>
                </div>
              </div>
              {!student?.healthCheckupRecords ||
              student.healthCheckupRecords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-3 bg-gray-50 rounded-full w-14 h-14 mx-auto mb-4">
                    <Calendar className="w-7 h-7 text-gray-400 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-base">
                    Chưa có lịch sử khám sức khỏe
                  </p>
                </div>
              ) : (
                <div className="max-w-6xl mx-auto p-6 bg-gray-50">
                  <div className="space-y-6">
                    {currentRecords.map((record, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="p-8">
                          <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Side - Time and Nurse Info */}
                            <div className="flex-shrink-0 lg:w-64">
                              <div className="space-y-6">
                                {/* Time Info */}
                                <div className="flex items-start gap-3">
                                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <Clock className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                      {formatDate(record.time)}
                                    </p>
                                    {record.isLatest && (
                                      <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-600" />
                                        <span className="text-xs font-medium text-gray-700">
                                          Khám gần nhất
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Nurse Info */}
                                <div className="flex items-start gap-3">
                                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <UserCheck className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-500 mb-1">
                                      Y tá thực hiện
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {record.nurseName || "Chưa có thông tin"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Side - Medical Data */}
                            <div className="flex-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Vision */}
                                <div className="group">
                                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors duration-200">
                                    <div className="p-2.5 bg-white rounded-xl border border-gray-200 group-hover:border-gray-300 transition-colors duration-200">
                                      <Eye className="w-5 h-5 text-gray-700" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-gray-500 mb-1">
                                        Thị lực
                                      </p>
                                      <p className="text-base font-semibold text-gray-900">
                                        {record.vision || "Chưa có thông tin"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Hearing */}
                                <div className="group">
                                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors duration-200">
                                    <div className="p-2.5 bg-white rounded-xl border border-gray-200 group-hover:border-gray-300 transition-colors duration-200">
                                      <Ear className="w-5 h-5 text-gray-700" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-gray-500 mb-1">
                                        Thính lực
                                      </p>
                                      <p className="text-base font-semibold text-gray-900">
                                        {record.hearing || "Chưa có thông tin"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Dental */}
                                <div className="group">
                                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors duration-200">
                                    <div className="p-2.5 bg-white rounded-xl border border-gray-200 group-hover:border-gray-300 transition-colors duration-200">
                                      <Stethoscope className="w-5 h-5 text-gray-700" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-gray-500 mb-1">
                                        Răng miệng
                                      </p>
                                      <p className="text-base font-semibold text-gray-900">
                                        {record.dental || "Chưa có thông tin"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* BMI */}
                                <div className="group">
                                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors duration-200">
                                    <div className="p-2.5 bg-white rounded-xl border border-gray-200 group-hover:border-gray-300 transition-colors duration-200">
                                      <Scale className="w-5 h-5 text-gray-700" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-gray-500 mb-1">
                                        BMI
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <p className="text-base font-semibold text-gray-900">
                                          {record.bmi || "Chưa có thông tin"}
                                        </p>
                                        {record.bmi && (
                                          <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                              getBMIStatus(record.bmi).bg
                                            } ${
                                              getBMIStatus(record.bmi).color
                                            }`}
                                          >
                                            {getBMIStatus(record.bmi).status}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Additional Information */}
                          {(record.recordDate || record.abnormalNote) && (
                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                              {record.recordDate &&
                                record.recordDate !== record.time && (
                                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Calendar className="w-4 h-4 text-gray-600" />
                                      <p className="text-sm font-medium text-gray-800">
                                        Ngày ghi nhận
                                      </p>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      {formatDate(record.recordDate)}
                                    </p>
                                  </div>
                                )}

                              {record.abnormalNote && (
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle className="w-4 h-4 text-gray-600" />
                                    <p className="text-sm font-medium text-gray-800">
                                      Ghi chú
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {record.abnormalNote}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {renderPagination()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
