import { useState, useEffect } from "react";
import { HealthProfileUpdate, Student } from "@/types/HealthProfile";
import {
  FecthHealthProfile,
  FecthUpdateHealthProfile,
} from "@/services/HealthProfileService"; // Fixed typo
import {
  Eye,
  Ear,
  Shield,
  Heart,
  AlertCircle,
  CheckCircle,
  PenBox,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { toast, ToastContainer } from "react-toastify";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/InputField";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

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
    bmi: 0,
    abnormalNote: "",
    vaccinationHistory: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleViewHealthProfile = (studentId: string) => {
    navigate(`/student/${studentId}/health-checkup-records`);
  };    

  const handleOpenUpdateModal = (studentId: string) => {
    const selectedStudent = healthProfiles.find(
      (student) => student.id === studentId
    );
    if (!selectedStudent) {
      setErrorModal("Student not found");
      return;
    }
    setFormData({
      vision: selectedStudent.healthProfile?.vision || "",
      hearing: selectedStudent.healthProfile?.hearing || "",
      dental: selectedStudent.healthProfile?.dental || "",
      bmi: selectedStudent.healthProfile?.bmi ?? 0,
      abnormalNote: selectedStudent.healthProfile?.abnormalNote || "",
      vaccinationHistory:
        selectedStudent.healthProfile?.vaccinationHistory || "",
    });
    setSelectedProfileId(studentId);
    setError(null);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProfileId(null);
    setErrorModal(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId) return;
    if (
      !formData.vision.trim() ||
      !formData.hearing.trim() ||
      !formData.dental.trim() ||
      formData.bmi <= 0 ||
      formData.bmi > 100 ||
      !formData.vaccinationHistory.trim() ||
      !formData.abnormalNote.trim()
    ) {
      setErrorModal(
        "All fields are required and BMI must be between 0 and 100."
      );
      return;
    }
    setSubmitting(true);
    try {
      await FecthUpdateHealthProfile(selectedProfileId, formData);
      toast.success("Health profile updated successfully");
      fetchData();
      setIsUpdateModalOpen(false);
      setSelectedProfileId(null);
      setErrorModal(null);
    } catch (err) {
      setErrorModal(
        `Failed to update user: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getHealthStatus = (profile: HealthProfileUpdate | null | undefined) => {
    if (!profile) return [];
    const issues: string[] = [];
    if (profile.vision !== "20/20") issues.push("Vision");
    if (profile.hearing !== "Normal") issues.push("Hearing");
    if (profile.dental?.includes("cavities")) issues.push("Dental");
    if (profile.abnormalNote !== "None") issues.push("Health Note");
    return issues;
  };

  const getBMIStatus = (bmi: number | null) => {
    if (bmi === null || isNaN(bmi)) {
      return { status: "No data", color: "text-gray-500" };
    }
    if (bmi < 18.5) return { status: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { status: "Normal", color: "text-green-600" };
    if (bmi < 30) return { status: "Overweight", color: "text-yellow-600" };
    return { status: "Obese", color: "text-red-600" };
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
        toast.warning(
          `Please complete health information for: ${studentNames}`,
          { autoClose: 5000 }
        );
      }

      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err instanceof Error && err.message.includes("authenticated")) {
        setError("Please log in to view health profiles.");
      } else {
        setError("Failed to fetch health profiles. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-sm border border-red-100"
        >
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-gray-800 mb-4">{error}</p>
            {error.includes("authenticated") ? (
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đăng nhập
              </button>
            ) : (
              <button
                onClick={fetchData}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            )}
          </div>
        </div>
      ) : healthProfiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-xl text-gray-600 mb-6">
            Không có hồ sơ sức khỏe nào
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Thêm hồ sơ sức khỏe học sinh
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                Hồ sơ sức khỏe
              </h1>
            </div>
          </div>
          <div className="grid gap-6">
            {healthProfiles.map((student, index) => {
              const healthIssues = getHealthStatus(
                student.healthProfile ?? null
              );
              const bmiStatus = getBMIStatus(
                student.healthProfile ? student.healthProfile.bmi ?? null : null
              );
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={student.image ?? undefined}
                            className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                            alt={student.fullName}
                          />
                          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                            {healthIssues.length === 0 ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-amber-500" />
                            )}
                          </div>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            {student.fullName}
                          </h2>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              {new Date(student.dateOfBirth).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                            <span>•</span>
                            <span>{student.gender}</span>
                            <span>•</span>
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                              Lớp {student.studentClass.className}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-[1rem]">
                        <button
                          onClick={() => handleViewHealthProfile(student.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Xem chi tiết
                        </button>
                        <button
                          onClick={() => handleOpenUpdateModal(student.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <PenBox className="w-4 h-4" />
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Thị lực
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {student.healthProfile?.vision || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Ear className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Thính lực
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {student.healthProfile?.hearing || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Răng miệng
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {student.healthProfile?.dental || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            BMI
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-600">
                            {student.healthProfile?.bmi || "Chưa cập nhật"}
                          </p>
                          {student.healthProfile?.bmi && (
                            <span
                              className={`text-xs font-medium ${bmiStatus.color}`}
                            >
                              ({bmiStatus.status})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Ghi chú bất thường
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {student.healthProfile?.abnormalNote || "Không có"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Lịch sử tiêm chủng
                          </span>
                        </div>
                        <p className="text-gray-600">
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

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        showCloseButton={true}
        isFullscreen={false}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Cập nhật hồ sơ sức khỏe
          </h2>
          {errorModal && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {errorModal}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Thị lực
              </Label>
              <Input
                type="text"
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ví dụ: 20/20"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Thính lực
              </Label>
              <Input
                type="text"
                name="hearing"
                value={formData.hearing}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ví dụ: Normal"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Răng miệng
              </Label>
              <Input
                type="text"
                name="dental"
                value={formData.dental}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ví dụ: No cavities"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                BMI
              </Label>
              <Input
                type="number"
                name="bmi"
                value={formData.bmi}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ví dụ: 22.5"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú bất thường
              </Label>
              <Input
                type="text"
                name="abnormalNote"
                value={formData.abnormalNote}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ví dụ: None"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Lịch sử tiêm chủng
              </Label>
              <Input
                type="text"
                name="vaccinationHistory"
                value={formData.vaccinationHistory}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ví dụ: Up to date"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleCloseUpdateModal}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
