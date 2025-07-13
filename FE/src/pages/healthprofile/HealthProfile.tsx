import { useState, useEffect } from "react";
import { HealthProfileUpdate, Student } from "@/types/HealthProfile";
import {
  FecthHealthProfile,
  FecthUpdateHealthProfile,
} from "@/services/HealthProfileService";
import {
  Eye,
  Ear,
  Shield,
  Heart,
  AlertCircle,
  CheckCircle,
  PenBox,
  Activity,
  User,
  Calendar,
  Weight,
  Ruler,
  MessageCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/InputField";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/ui/Toast";

export default function HealthProfiles() {
  const [healthProfiles, setHealthProfiles] = useState<Student[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [formData, setFormData] = useState<HealthProfileUpdate>({
    vision: "",
    hearing: "",
    dental: "",
    height: 0,
    weight: 0,
    bmi: 0,
    abnormalNote: "",
    vaccinationHistory: "",
    parentNote: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const navigate = useNavigate();

  // Tính BMI tự động khi nhập chiều cao/cân nặng
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightM = formData.height / 100;
      const bmi = formData.weight / (heightM * heightM);
      setFormData((prev) => ({ ...prev, bmi: Number(bmi.toFixed(1)) }));
    }
  }, [formData.height, formData.weight]);

  // Validation functions
  const validateVision = (vision: string) => {
    if (!vision.trim()) return "Thị lực không được để trống";

    // Kiểm tra format thị lực (ví dụ: 20/20, 20/40, 6/6, etc.)
    const visionPattern = /^(\d+\/\d+|\d+\.\d+|\d+)$/;
    if (!visionPattern.test(vision.trim())) {
      return "Định dạng thị lực không hợp lệ (VD: 20/20, 6/6, 0.8)";
    }

    return "";
  };

  const validateHearing = (hearing: string) => {
    if (!hearing.trim()) return "Thính lực không được để trống";

    const validHearingValues = [
      "Bình thường",
      "Tốt",
      "Khá",
      "Trung bình",
      "Kém",
      "Điếc",
      "Normal",
      "Good",
      "Fair",
      "Poor",
      "Deaf",
      "Không có vấn đề",
      "Có vấn đề nhẹ",
      "Cần kiểm tra thêm",
    ];

    if (
      !validHearingValues.some((value) =>
        hearing.toLowerCase().includes(value.toLowerCase())
      )
    ) {
      return "Giá trị thính lực không hợp lệ";
    }

    return "";
  };

  const validateDental = (dental: string) => {
    if (!dental.trim()) return "Tình trạng răng miệng không được để trống";

    const validDentalValues = [
      "Tốt",
      "Bình thường",
      "Khá",
      "Cần chăm sóc",
      "Có sâu răng",
      "Good",
      "Normal",
      "Fair",
      "Needs care",
      "Has cavities",
      "Không có vấn đề",
      "Cần điều trị",
      "Đã điều trị",
    ];

    if (
      !validDentalValues.some((value) =>
        dental.toLowerCase().includes(value.toLowerCase())
      )
    ) {
      return "Giá trị răng miệng không hợp lệ";
    }

    return "";
  };

  const validateHeight = (height: number) => {
    if (height <= 0) return "Chiều cao phải lớn hơn 0";
    if (height < 50 || height > 250) return "Chiều cao phải từ 50-250 cm";
    return "";
  };

  const validateWeight = (weight: number) => {
    if (weight <= 0) return "Cân nặng phải lớn hơn 0";
    if (weight < 10 || weight > 200) return "Cân nặng phải từ 10-200 kg";
    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numberFields = ["height", "weight", "bmi"];

    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "vision":
        error = validateVision(value);
        break;
      case "hearing":
        error = validateHearing(value);
        break;
      case "dental":
        error = validateDental(value);
        break;
      case "height":
        error = validateHeight(Number(value));
        break;
      case "weight":
        error = validateWeight(Number(value));
        break;
    }

    if (error) {
      setValidationErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleViewHealthProfile = (studentId: string) => {
    navigate(`/dashboard/student/${studentId}/health-checkup-records`);
  };

  const handleOpenUpdateModal = (studentId: string) => {
    const selectedStudent = healthProfiles.find(
      (student) => student.id === studentId
    );
    if (!selectedStudent) {
      setErrorModal("Không tìm thấy học sinh");
      return;
    }
    setFormData({
      vision: selectedStudent.healthProfile?.vision || "",
      hearing: selectedStudent.healthProfile?.hearing || "",
      dental: selectedStudent.healthProfile?.dental || "",
      height: selectedStudent.healthProfile?.height ?? 0,
      weight: selectedStudent.healthProfile?.weight ?? 0,
      bmi: selectedStudent.healthProfile?.bmi ?? 0,
      abnormalNote: selectedStudent.healthProfile?.abnormalNote || "",
      vaccinationHistory:
        selectedStudent.healthProfile?.vaccinationHistory || "",
      parentNote: selectedStudent.healthProfile?.parentNote || "",
    });
    setSelectedProfileId(studentId);
    setError(null);
    setValidationErrors({});
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProfileId(null);
    setErrorModal(null);
    setValidationErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId) return;

    // Validate all fields
    const errors: { [key: string]: string } = {};

    const visionError = validateVision(formData.vision);
    if (visionError) errors.vision = visionError;

    const hearingError = validateHearing(formData.hearing);
    if (hearingError) errors.hearing = hearingError;

    const dentalError = validateDental(formData.dental);
    if (dentalError) errors.dental = dentalError;

    const heightError = validateHeight(formData.height);
    if (heightError) errors.height = heightError;

    const weightError = validateWeight(formData.weight);
    if (weightError) errors.weight = weightError;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setErrorModal("Vui lòng kiểm tra và sửa các lỗi trong form");
      return;
    }

    setSubmitting(true);
    try {
      console.log("formData gửi lên:", formData);
      await FecthUpdateHealthProfile(selectedProfileId, formData);
      showToast.success("Cập nhật hồ sơ sức khỏe thành công");
      fetchData();
      setIsUpdateModalOpen(false);
      setSelectedProfileId(null);
      setErrorModal(null);
      setValidationErrors({});
    } catch (err) {
      setErrorModal(
        `Không thể cập nhật hồ sơ: ${
          err instanceof Error ? err.message : "Lỗi không xác định"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getHealthStatus = (profile: HealthProfileUpdate | null | undefined) => {
    if (!profile) return [];
    const issues: string[] = [];
    if (profile.vision !== "20/20" && profile.vision !== "6/6")
      issues.push("Thị lực");
    if (profile.hearing !== "Bình thường" && profile.hearing !== "Tốt")
      issues.push("Thính lực");
    if (
      profile.dental?.includes("sâu răng") ||
      profile.dental?.includes("cavities")
    )
      issues.push("Răng miệng");
    if (profile.abnormalNote !== "Không có") issues.push("Ghi chú sức khỏe");
    return issues;
  };

  const getBMIStatus = (bmi: number | null) => {
    if (bmi === null || isNaN(bmi)) {
      return { status: "Chưa có dữ liệu", color: "text-gray-500" };
    }
    if (bmi < 18.5) return { status: "Thiếu cân", color: "text-blue-600" };
    if (bmi < 25) return { status: "Bình thường", color: "text-green-600" };
    if (bmi < 30) return { status: "Thừa cân", color: "text-yellow-600" };
    return { status: "Béo phì", color: "text-red-600" };
  };

  const getVisionStatus = (vision: string | null | undefined) => {
    if (!vision) return { status: "Chưa kiểm tra", color: "text-gray-500" };

    if (
      vision.toLowerCase().includes("20/20") ||
      vision.toLowerCase().includes("6/6")
    ) {
      return { status: "Tốt", color: "text-green-600" };
    }
    if (vision.toLowerCase().includes("khá")) {
      return { status: "Khá", color: "text-blue-600" };
    }
    if (vision.toLowerCase().includes("trung bình")) {
      return { status: "Trung bình", color: "text-yellow-600" };
    }
    if (
      vision.toLowerCase().includes("kém") ||
      vision.toLowerCase().includes("điếc")
    ) {
      return { status: "Kém", color: "text-red-600" };
    }

    return { status: "Cần kiểm tra", color: "text-gray-500" };
  };

  const getHearingStatus = (hearing: string | null | undefined) => {
    if (!hearing) return { status: "Chưa kiểm tra", color: "text-gray-500" };

    if (
      hearing.toLowerCase().includes("bình thường") ||
      hearing.toLowerCase().includes("tốt")
    ) {
      return { status: "Tốt", color: "text-green-600" };
    }
    if (hearing.toLowerCase().includes("khá")) {
      return { status: "Khá", color: "text-blue-600" };
    }
    if (hearing.toLowerCase().includes("trung bình")) {
      return { status: "Trung bình", color: "text-yellow-600" };
    }
    if (
      hearing.toLowerCase().includes("kém") ||
      hearing.toLowerCase().includes("điếc")
    ) {
      return { status: "Kém", color: "text-red-600" };
    }

    return { status: "Cần kiểm tra", color: "text-gray-500" };
  };

  const getDentalStatus = (dental: string | null | undefined) => {
    if (!dental) return { status: "Chưa kiểm tra", color: "text-gray-500" };

    if (
      dental.toLowerCase().includes("tốt") ||
      dental.toLowerCase().includes("bình thường")
    ) {
      return { status: "Tốt", color: "text-green-600" };
    }
    if (dental.toLowerCase().includes("khá")) {
      return { status: "Khá", color: "text-blue-600" };
    }
    if (dental.toLowerCase().includes("cần chăm sóc")) {
      return { status: "Cần chăm sóc", color: "text-yellow-600" };
    }
    if (
      dental.toLowerCase().includes("sâu răng") ||
      dental.toLowerCase().includes("cavities")
    ) {
      return { status: "Cần điều trị", color: "text-red-600" };
    }

    return { status: "Cần kiểm tra", color: "text-gray-500" };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedProfile = await FecthHealthProfile();
      setHealthProfiles(fetchedProfile);
      const studentsWithMissingData = fetchedProfile.filter((student) => {
        const healthProfile = student.healthProfile;
        return (
          !healthProfile ||
          !healthProfile.vision ||
          !healthProfile.hearing ||
          !healthProfile.dental ||
          !healthProfile.bmi ||
          !healthProfile.abnormalNote ||
          !healthProfile.vaccinationHistory
        );
      });
      if (studentsWithMissingData.length > 0) {
        const studentNames = studentsWithMissingData
          .map((s) => s.fullName)
          .join(", ");
        showToast.warning(
          `Vui lòng hoàn thành thông tin sức khỏe cho: ${studentNames}`
        );
      }

      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err instanceof Error && err.message.includes("authenticated")) {
        setError("Vui lòng đăng nhập để xem hồ sơ sức khỏe.");
      } else {
        setError("Không thể tải hồ sơ sức khỏe. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-gray-600">Đang tải hồ sơ sức khỏe...</p>
          </div>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow border border-red-100"
        >
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            {error.includes("authenticated") ? (
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đăng nhập
              </button>
            ) : (
              <button
                onClick={fetchData}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            )}
          </div>
        </div>
      ) : healthProfiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có hồ sơ sức khỏe nào
            </h2>
            <p className="text-gray-500 mb-6">
              Hệ thống chưa có dữ liệu hồ sơ sức khỏe của học sinh nào.
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Thêm hồ sơ sức khỏe học sinh
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Hồ sơ sức khỏe học sinh
                </h1>
                <p className="text-gray-600 text-sm">
                  Quản lý và theo dõi thông tin sức khỏe của học sinh
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {healthProfiles.length} học sinh
            </div>
          </div>

          {/* Health Profiles Grid */}
          <div className="grid gap-4">
            {healthProfiles.map((student, index) => {
              const healthIssues = getHealthStatus(student.healthProfile);
              const bmiStatus = getBMIStatus(
                student.healthProfile?.bmi ?? null
              );
              const visionStatus = getVisionStatus(
                student.healthProfile?.vision
              );
              const hearingStatus = getHearingStatus(
                student.healthProfile?.hearing
              );
              const dentalStatus = getDentalStatus(
                student.healthProfile?.dental
              );

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Student Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={student.image ?? undefined}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                            alt={student.fullName}
                          />
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-200">
                            {healthIssues.length === 0 ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            {student.fullName}
                          </h2>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(
                                  student.dateOfBirth
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{student.gender}</span>
                            </div>
                            <span>•</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              Lớp {student.studentClass.className}
                            </span>
                          </div>
                          {healthIssues.length > 0 && (
                            <div className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-yellow-600">
                                Cần chú ý: {healthIssues.join(", ")}
                              </span>
                            </div>
                          )}
                          {student.healthProfile?.parentNote && (
                            <div className="flex items-center gap-1 mt-2">
                              <MessageCircle className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-blue-600">
                                Ghi chú của phụ huynh:{" "}
                                {student.healthProfile?.parentNote}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewHealthProfile(student.id)}
                          className="flex items-center gap-1 px-3 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Xem chi tiết
                        </button>
                        <button
                          onClick={() => handleOpenUpdateModal(student.id)}
                          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                        >
                          <PenBox className="w-3 h-3" />
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>

                    {/* Health Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Vision */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">
                              Thị lực
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${visionStatus.color}`}
                          >
                            {visionStatus.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {student.healthProfile?.vision || "Chưa cập nhật"}
                        </p>
                      </div>

                      {/* Hearing */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Ear className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">
                              Thính lực
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${hearingStatus.color}`}
                          >
                            {hearingStatus.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {student.healthProfile?.hearing || "Chưa cập nhật"}
                        </p>
                      </div>

                      {/* Dental */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700">
                              Răng miệng
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${dentalStatus.color}`}
                          >
                            {dentalStatus.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {student.healthProfile?.dental || "Chưa cập nhật"}
                        </p>
                      </div>

                      {/* BMI Section */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium text-gray-700">
                              Chỉ số BMI
                            </span>
                          </div>
                          {student.healthProfile?.bmi && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${bmiStatus.color}`}
                            >
                              {bmiStatus.status}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-800">
                              {student.healthProfile?.bmi ?? "N/A"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Ruler className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-600">Chiều cao:</span>
                              <span className="font-medium text-gray-800">
                                {student.healthProfile?.height
                                  ? `${student.healthProfile.height} cm`
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Weight className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-600">Cân nặng:</span>
                              <span className="font-medium text-gray-800">
                                {student.healthProfile?.weight
                                  ? `${student.healthProfile.weight} kg`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Abnormal Notes */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Ghi chú bất thường
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {student.healthProfile?.abnormalNote || "Không có"}
                        </p>
                      </div>

                      {/* Vaccination History */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-teal-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Lịch sử tiêm chủng
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {student.healthProfile?.vaccinationHistory ||
                            "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        isFullscreen={false}
        className="w-full max-w-3xl mt-10"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Cập nhật hồ sơ sức khỏe
            </h2>
          </div>

          {errorModal && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errorModal}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vision */}
            <div className="space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                Thị lực <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                  validationErrors.vision ? "border-red-300" : ""
                }`}
                placeholder="VD: 20/20, 6/6, 0.8"
              />
              {validationErrors.vision && (
                <p className="text-xs text-red-600 mt-1">
                  {validationErrors.vision}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Định dạng: 20/20, 6/6, 0.8 (thị lực chuẩn)
              </p>
            </div>

            {/* Hearing */}
            <div className="space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                Thính lực <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="hearing"
                value={formData.hearing}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                  validationErrors.hearing ? "border-red-300" : ""
                }`}
                placeholder="VD: Bình thường, Tốt, Khá"
              />
              {validationErrors.hearing && (
                <p className="text-xs text-red-600 mt-1">
                  {validationErrors.hearing}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Bình thường, Tốt, Khá, Trung bình, Kém, Điếc
              </p>
            </div>

            {/* Dental */}
            <div className="space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                Răng miệng <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="dental"
                value={formData.dental}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                  validationErrors.dental ? "border-red-300" : ""
                }`}
                placeholder="VD: Tốt, Bình thường, Có sâu răng"
              />
              {validationErrors.dental && (
                <p className="text-xs text-red-600 mt-1">
                  {validationErrors.dental}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Tốt, Bình thường, Khá, Cần chăm sóc, Có sâu răng
              </p>
            </div>

            {/* Height */}
            <div className="space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                Chiều cao (cm) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                  validationErrors.height ? "border-red-300" : ""
                }`}
                placeholder="VD: 170"
              />
              {validationErrors.height && (
                <p className="text-xs text-red-600 mt-1">
                  {validationErrors.height}
                </p>
              )}
              <p className="text-xs text-gray-500">Phạm vi: 50-250 cm</p>
            </div>

            {/* Weight */}
            <div className="space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                Cân nặng (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                  validationErrors.weight ? "border-red-300" : ""
                }`}
                placeholder="VD: 65"
              />
              {validationErrors.weight && (
                <p className="text-xs text-red-600 mt-1">
                  {validationErrors.weight}
                </p>
              )}
              <p className="text-xs text-gray-500">Phạm vi: 10-200 kg</p>
            </div>

            {/* BMI (Auto-calculated) */}
            <div className="space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                Chỉ số BMI (Tự động tính)
              </Label>
              <div className="relative">
                <input
                  type="text"
                  value={
                    formData.bmi
                      ? `${formData.bmi} - ${getBMIStatus(formData.bmi).status}`
                      : "Chưa có dữ liệu"
                  }
                  readOnly
                  disabled
                  className="w-full rounded-lg border-gray-200 bg-gray-50 text-gray-700 px-3 py-3 cursor-not-allowed"
                />
                {formData.bmi && (
                  <div
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs font-medium ${
                      getBMIStatus(formData.bmi).color
                    }`}
                  >
                    {getBMIStatus(formData.bmi).status}
                  </div>
                )}
              </div>
            </div>

            {/* Abnormal Notes */}
            <div className="md:col-span-2 space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                Ghi chú bất thường
              </Label>
              <Input
                type="text"
                name="abnormalNote"
                value={formData.abnormalNote}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="VD: Không có, Cần theo dõi, Đã điều trị"
              />
            </div>

            {/* Vaccination History */}
            <div className="md:col-span-2 space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                Lịch sử tiêm chủng
              </Label>
              <Input
                type="text"
                name="vaccinationHistory"
                value={formData.vaccinationHistory}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="VD: Đã tiêm đầy đủ, Cần bổ sung"
              />
            </div>

            {/* Parent Notes */}
            <div className="md:col-span-2 space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                Ghi chú phụ huynh
              </Label>
              <Input
                type="text"
                name="parentNote"
                value={formData.parentNote}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="VD: Không có, Cần lưu ý"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseUpdateModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
