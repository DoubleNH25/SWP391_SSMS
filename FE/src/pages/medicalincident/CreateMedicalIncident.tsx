import { useCallback, useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  AlertTriangle,
  Pill,
  X,
  ArrowLeft,
} from "lucide-react";
import { IncidentCreateViewModel, MedicalUsageDetail } from "@/types/Incident";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import { useParams, useNavigate } from "react-router-dom";
import { FecthStudentById } from "@/services/UserService";
import { FecthMedical } from "@/services/MedicalService";
import { MedicalViewModel } from "@/types/Medical";
import { DateUtils } from "@/utils/DateUtils";
import { FecthCreateIncident } from "@/services/IncidentService";
import SearchableSelect from "@/components/ui/form/SearchableSelect";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/Toast";

export default function CreateMedicalIncident() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState<{
    studentName: string;
    studentCode: string;
  }>({
    studentName: "",
    studentCode: "",
  });

  const [medicineOptions, setMedicineOptions] = useState<
    { value: string; label: string; stock: number }[]
  >([]);

  const [formData, setFormData] = useState<IncidentCreateViewModel>({
    studentId: studentId || "",
    type: "",
    description: "",
    incidentDate: "",
    medicalUsageDetails: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Validate only step 1 fields
  const validateStep1 = (): boolean => {
    const stepErrors: Record<string, string> = {};
    const { studentId, type, description } = formData;

    if (!studentId?.trim()) stepErrors.studentId = "Mã học sinh bắt buộc";
    if (!type?.trim()) stepErrors.type = "Loại sự cố bắt buộc";
    if (!description?.trim()) stepErrors.description = "Mô tả sự cố bắt buộc";

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Validate only step 2 fields (medicine)
  const validateStep2 = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (formData.medicalUsageDetails.length === 0) {
      stepErrors.medicalUsageDetails = "Cần nhập ít nhất một thuốc";
    } else {
      formData.medicalUsageDetails.forEach((detail, index) => {
        if (!detail.medicalStockId?.trim()) {
          stepErrors[`medicalStockId_${index}`] = "Chọn thuốc";
        }
        if (!detail.dosage?.trim()) {
          stepErrors[`dosage_${index}`] = "Liều dùng bắt buộc";
        }
        if (!detail.quantity || detail.quantity <= 0) {
          stepErrors[`quantity_${index}`] = "Số lượng hợp lệ bắt buộc";
        } else {
          const selectedMedicine = medicineOptions.find(
            (med) => med.value === detail.medicalStockId
          );
          if (selectedMedicine && detail.quantity > selectedMedicine.stock) {
            stepErrors[
              `quantity_${index}`
            ] = `Số lượng vượt quá kho (còn lại: ${selectedMedicine.stock})`;
          }
        }
      });
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleMedicineChange = useCallback(
    (index: number, value: string) => {
      const updatedDetails = [...formData.medicalUsageDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        medicalStockId: value,
      };
      setFormData((prev) => ({
        ...prev,
        medicalUsageDetails: updatedDetails,
      }));

      const errorKey = `medicalStockId_${index}`;
      if (errors[errorKey]) {
        setErrors((prev) => ({
          ...prev,
          [errorKey]: "",
        }));
      }
    },
    [formData.medicalUsageDetails, errors]
  );

  const resetForm = () => {
    setFormData({
      studentId: studentId || "",
      type: "",
      description: "",
      incidentDate: "",
      medicalUsageDetails: [],
    });
    setCurrentStep(1);
    setErrors({});
  };

  const loadUser = useCallback(async () => {
    if (!studentId) {
      setErrors({ general: "Mã học sinh bắt buộc." });
      return;
    }

    setLoading(true);
    try {
      const user = await FecthStudentById(studentId);
      if (user) {
        const info = {
          studentName: user.fullName,
          studentCode: user.studentCode,
        };
        setStudentInfo(info);
        setFormData((prev) => ({
          ...prev,
          studentId: studentId,
        }));
        setErrors({});
      } else {
        throw new Error("Không tìm thấy học sinh");
      }
    } catch (err) {
      setErrors({
        general:
          err instanceof Error && err.message.includes("authenticated")
            ? "Vui lòng đăng nhập để xem dữ liệu học sinh."
            : "Không thể tải dữ liệu học sinh. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const loadMedicine = useCallback(async () => {
    setLoading(true);
    try {
      const data = await FecthMedical();
      const options = data.map((medicineItem: MedicalViewModel) => ({
        value: medicineItem.id,
        label: medicineItem.name,
        stock: medicineItem.quantity || 0,
      }));
      setMedicineOptions(options);
      setErrors((prev) => ({ ...prev, general: "" }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general:
          err instanceof Error && err.message.includes("authenticated")
            ? "Vui lòng đăng nhập để xem thuốc."
            : "Không thể lấy dữ liệu thuốc. Vui lòng thử lại sau.",
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      loadUser();
    }
  }, [loadUser]);

  useEffect(() => {
    if (currentStep === 2 && medicineOptions.length === 0) {
      loadMedicine();
    }
  }, [currentStep, medicineOptions.length, loadMedicine]);

  const handleChangeFirst = (
    field: keyof IncidentCreateViewModel,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleChangeSecond = (
    index: number,
    field: keyof MedicalUsageDetail,
    value: string | number
  ) => {
    const updatedDetails = [...formData.medicalUsageDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      medicalUsageDetails: updatedDetails,
    }));

    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }

    // Real-time validation for quantity
    if (field === "quantity" && typeof value === "number" && value > 0) {
      const selectedMedicine = medicineOptions.find(
        (med) => med.value === updatedDetails[index].medicalStockId
      );
      if (selectedMedicine && value > selectedMedicine.stock) {
        setErrors((prev) => ({
          ...prev,
          [`quantity_${index}`]: `Số lượng vượt quá kho (còn lại: ${selectedMedicine.stock})`,
        }));
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const addMedicalUsage = () => {
    setFormData((prev) => ({
      ...prev,
      medicalUsageDetails: [
        ...prev.medicalUsageDetails,
        { medicalStockId: "", dosage: "", quantity: 0 },
      ],
    }));
  };

  const removeMedicalUsage = (index: number) => {
    if (formData.medicalUsageDetails.length > 1) {
      const updatedDetails = formData.medicalUsageDetails.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        medicalUsageDetails: updatedDetails,
      }));
    }
  };

  // Handle step 1 completion - show modal for confirmation
  const handleCompleteStep1 = () => {
    if (!validateStep1()) return;
    setShowConfirmModal(true);
  };

  // Handle final submission without medicine
  const handleSubmitWithoutMedicine = async () => {
    const payload: IncidentCreateViewModel = {
      ...formData,
      incidentDate: DateUtils.customFormatDateForBackend(new Date()),
      medicalUsageDetails: [], // No medicine
    };

    setLoading(true);
    try {
      await FecthCreateIncident(payload);
      setShowConfirmModal(false);
      showToast.success("Báo cáo không thuốc đã được gửi!");
      resetForm();
      // Optional: redirect or reset form
    } catch (err) {
      setErrors({
        general:
          err instanceof Error
            ? err.message
            : "Không thể tạo báo cáo. Vui lòng thử lại.",
      });
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle proceeding to step 2 for medicine selection
  const handleProceedToStep2 = () => {
    setShowConfirmModal(false);
    setCurrentStep(2);
    // Initialize with one empty medicine entry if none exists
    if (formData.medicalUsageDetails.length === 0) {
      setFormData((prev) => ({
        ...prev,
        medicalUsageDetails: [{ medicalStockId: "", dosage: "", quantity: 0 }],
      }));
    }
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(1);
      setIsTransitioning(false);
    }, 150);
  };

  // Handle final submission with medicine
  const handleSubmitWithMedicine = async () => {
    if (!validateStep2()) return;

    const payload: IncidentCreateViewModel = {
      ...formData,
      incidentDate: DateUtils.customFormatDateForBackend(new Date()),
    };

    setLoading(true);
    try {
      await FecthCreateIncident(payload);
      showToast.success("Báo cáo đã được gửi thành công!");
      resetForm();
      // Optional: redirect or reset form
    } catch (err) {
      setErrors({
        general:
          err instanceof Error
            ? err.message
            : "Không thể tạo báo cáo. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Thông tin sự cố", icon: AlertTriangle },
    { number: 2, title: "Thông tin sử dụng thuốc", icon: Pill },
  ];

  const handleBack = () => {
    navigate("/dashboard/medical/medical-request");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Báo Cáo Sự Cố Y Tế
          </h1>
          <p className="text-gray-600">
            Vui lòng điền thông tin bên dưới để tạo báo cáo của bạn
          </p>
          {studentInfo && (
            <>
              <p className="text-sm text-gray-500 mt-2">
                Học sinh: {studentInfo.studentName}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Mã học sinh: {studentInfo.studentCode}
              </p>
            </>
          )}
        </div>

        {/* Error Display */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 relative">
            <div className="absolute sm:top-5 top-10 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute sm:top-5 top-10 left-0 h-0.5 bg-slate-900 transition-all duration-500 ease-out z-0"
              style={{ width: currentStep === 1 ? "0%" : "100%" }}
            />
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.number;
              const isCompleted = currentStep > step.number;
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center flex-1 z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      isCompleted
                        ? "bg-slate-900 text-white"
                        : isActive
                        ? "bg-slate-900 text-white"
                        : "bg-white border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <div
                    className={`mt-3 text-xs sm:text-sm font-medium text-center ${
                      isActive ? "text-slate-900" : "text-gray-500"
                    }`}
                  >
                    <div className="hidden sm:block">{step.title}</div>
                    <div className="sm:hidden">Bước {step.number}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className={`p-4 sm:p-8 transition-all duration-300 ${
              isTransitioning ? "opacity-50" : "opacity-100"
            }`}
          >
            {/* Step 1 - Only incident information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="type">Kiểu bị thương</Label>
                  <Input
                    id="type"
                    type="text"
                    value={formData.type}
                    onChange={(e) => handleChangeFirst("type", e.target.value)}
                    placeholder="Ví dụ: Ngã, Va đập, Cắt..."
                  />
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Chi tiết</Label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full h-32 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả chi tiết về sự cố xảy ra..."
                    value={formData.description}
                    onChange={handleTextareaChange}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 - Medicine information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Thông tin sử dụng thuốc
                  </h3>
                  <p className="text-sm text-blue-600">
                    Vui lòng nhập thông tin về các loại thuốc đã sử dụng để xử
                    lý sự cố.
                  </p>
                </div>

                {formData.medicalUsageDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Thuốc {index + 1}</h4>
                      {formData.medicalUsageDetails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicalUsage(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                      <div className="sm:col-span-2">
                        <Label>Thuốc</Label>
                        <SearchableSelect
                          options={medicineOptions.map((med) => ({
                            value: med.value,
                            label: `${med.label} (Còn: ${med.stock})`,
                          }))}
                          placeholder="Chọn thuốc"
                          onChange={(value) =>
                            handleMedicineChange(index, value)
                          }
                          className="dark:bg-dark-900"
                        />
                        {errors[`medicalStockId_${index}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`medicalStockId_${index}`]}
                          </p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Liều dùng</Label>
                        <Input
                          type="text"
                          value={detail.dosage}
                          placeholder="Ví dụ: 1 viên, 5ml..."
                          onChange={(e) =>
                            handleChangeSecond(index, "dosage", e.target.value)
                          }
                        />
                        {errors[`dosage_${index}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`dosage_${index}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Số lượng</Label>
                        <Input
                          type="number"
                          min="1"
                          max={String(
                            medicineOptions.find(
                              (med) => med.value === detail.medicalStockId
                            )?.stock || 999
                          )}
                          value={detail.quantity}
                          onChange={(e) =>
                            handleChangeSecond(
                              index,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                        />
                        {/* Show available stock info */}
                        {detail.medicalStockId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Còn lại:{" "}
                            {medicineOptions.find(
                              (med) => med.value === detail.medicalStockId
                            )?.stock || 0}
                          </p>
                        )}
                        {errors[`quantity_${index}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`quantity_${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMedicalUsage}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  + Thêm thuốc
                </button>

                {errors.medicalUsageDetails && (
                  <p className="text-red-500 text-sm">
                    {errors.medicalUsageDetails}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                    Quay lại
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={handleCompleteStep1}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
                  >
                    {loading ? "Đang xử lý..." : "Tiếp tục"}
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitWithMedicine}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
                  >
                    <Check size={18} />
                    {loading ? "Đang gửi..." : "Gửi báo cáo"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <Modal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            showCloseButton={false}
            isFullscreen={false}
            className="p-5 max-w-md "
          >
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xác nhận báo cáo học sinh {studentInfo.studentName}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    Mã học sinh {studentInfo.studentCode}
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Bạn muốn hoàn thành báo cáo sự cố ngay bây giờ hay cần thêm
                  thông tin về thuốc đã sử dụng?
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Thông tin sự cố:
                  </h4>
                  <p className="text-sm text-gray-600">
                    <strong>Loại:</strong> {formData.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Mô tả:</strong> {formData.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSubmitWithoutMedicine}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? "Đang gửi..." : "Hoàn thành không cần thuốc"}
                </button>

                <button
                  onClick={handleProceedToStep2}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  Thêm thông tin thuốc
                </button>

                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Quay lại chỉnh sửa
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
