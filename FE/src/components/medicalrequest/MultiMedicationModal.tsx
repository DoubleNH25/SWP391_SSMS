import React, { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import DatePicker from "@/components/ui/form/DateField";
import Label from "@/components/ui/form/Label";
import { Student } from "@/types/Student";
import { DateUtils } from "@/utils/DateUtils";
import { showToast } from "../ui/Toast";
import { FecthCreateMedicalRequest } from "@/services/MedicalRequest";
import { UploadBlogImage } from "@/services/BlogService";
import { addDays } from "date-fns";

interface Medication {
  id: string;
  medicationName: string;
  form: string;
  dosage: number; // Changed from string to number
  route: string;
  frequency: number;
  totalQuantity: string;
  timeToAdminister: string[];
  startDate: string;
  endDate: string;
  note: string;
  // Add calculation info
  treatmentDays?: number;
  leftoverUnits?: number;
}

interface MultiMedicationModalProps {
  parentId: string;
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
  selectedStudent: Student | null;
  onSubmit: (medications: Medication[]) => void;
}

const MultiMedicationModal: React.FC<MultiMedicationModalProps> = ({
  parentId,
  studentId,
  isOpen,
  onClose,
  selectedStudent,
  onSubmit,
}) => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      medicationName: "",
      form: "Viên nén",
      dosage: 0, // Changed from "" to 0
      route: "Uống",
      frequency: 1,
      totalQuantity: "",
      timeToAdminister: [""],
      startDate: "",
      endDate: "",
      note: "",
    },
  ]);

  // Thêm state cho ảnh đơn thuốc
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // Thêm state errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add useEffect to automatically sync timeToAdminister with frequency
  useEffect(() => {
    setMedications((prevMedications) =>
      prevMedications.map((med) => {
        const currentLength = med.timeToAdminister.length;
        const targetLength = med.frequency;

        if (targetLength > currentLength) {
          // Thêm slots mới với giá trị rỗng
          const newTimeSlots = Array(targetLength - currentLength).fill("");
          return {
            ...med,
            timeToAdminister: [...med.timeToAdminister, ...newTimeSlots],
          };
        } else if (targetLength < currentLength) {
          // Cắt bớt nếu giảm frequency
          return {
            ...med,
            timeToAdminister: med.timeToAdminister.slice(0, targetLength),
          };
        }
        return med;
      })
    );
  }, [medications.map((med) => `${med.id}-${med.frequency}`).join(",")]); // More stable dependency

  // Add useEffect to reset route when form changes
  useEffect(() => {
    setMedications((prevMedications) =>
      prevMedications.map((med) => {
        const availableRoutes = getRoutesByForm(med.form);
        if (
          availableRoutes.length > 0 &&
          !availableRoutes.includes(med.route)
        ) {
          // Reset route if current route is not valid for the new form
          return {
            ...med,
            route: availableRoutes[0], // Set to first available route
          };
        }
        return med;
      })
    );
  }, [medications.map((med) => `${med.id}-${med.form}`).join(",")]);

  // Add useEffect to automatically calculate endDate
  useEffect(() => {
    setMedications((prevMedications) =>
      prevMedications.map((med) => {
        if (
          med.startDate &&
          med.totalQuantity &&
          med.dosage > 0 &&
          med.frequency > 0
        ) {
          const totalUnits = parseFloat(med.totalQuantity);
          const unitsPerDose = med.dosage;
          const dosesPerDay = med.frequency;

          if (totalUnits > 0 && unitsPerDose > 0 && dosesPerDay > 0) {
            const dailyUnits = dosesPerDay * unitsPerDose;
            const days = Math.ceil(totalUnits / dailyUnits);
            const excess = days * dailyUnits - totalUnits;
            const startDate = new Date(med.startDate);
            const calculatedEndDate = addDays(startDate, days - 1);

            return {
              ...med,
              endDate: DateUtils.customFormatDateOnly(calculatedEndDate),
              // Add calculation info for display
              treatmentDays: days,
              leftoverUnits: excess,
            };
          }
        }
        return med;
      })
    );
  }, [
    medications
      .map(
        (med) =>
          `${med.id}-${med.startDate}-${med.totalQuantity}-${med.dosage}-${med.frequency}`
      )
      .join(","),
  ]);

  const medicationForms = [
    "Viên nén",
    "Siro",
    "Thuốc nhỏ mắt",
    "Kem bôi",
    "Viên con nhộng",
    "Thuốc tiêm",
    "Thuốc mỡ",
    "Thuốc đặt",
    "Thuốc hít",
    "Vắc-xin",
    "Khác",
  ];

  // Mapping ràng buộc "Cách dùng" theo "Dạng thuốc"
  const routesByForm: Record<string, string[]> = {
    "Viên nén": ["Uống", "Ngậm"],
    "Viên con nhộng": ["Uống"],
    Siro: ["Uống"],
    "Thuốc nhỏ mắt": ["Nhỏ mắt"],
    "Thuốc nhỏ tai": ["Nhỏ tai"],
    "Thuốc nhỏ mũi": ["Nhỏ mũi"],
    "Kem bôi": ["Bôi ngoài da"],
    "Thuốc mỡ": ["Bôi ngoài da"],
    "Thuốc tiêm": ["Tiêm"],
    "Thuốc hít": ["Hít"],
    "Thuốc đặt": ["Đặt"],
    "Vắc-xin": ["Tiêm"],
    Khác: [
      "Uống",
      "Ngậm",
      "Nhỏ mắt",
      "Nhỏ tai",
      "Nhỏ mũi",
      "Bôi ngoài da",
      "Tiêm",
      "Hít",
      "Đặt",
    ],
  };

  // Mapping đơn vị theo "Cách dùng"
  const unitByRoute: Record<string, string> = {
    Uống: "viên",
    Ngậm: "viên",
    "Nhỏ mắt": "giọt",
    "Nhỏ tai": "giọt",
    "Nhỏ mũi": "giọt",
    "Bôi ngoài da": "gói",
    Tiêm: "ống",
    Hít: "ống",
    Đặt: "viên",
  };

  // Helper function to get unit based on route
  const getUnitByRoute = (route: string): string => {
    return unitByRoute[route] || "đơn vị";
  };

  // Helper function to get available routes for a form
  const getRoutesByForm = (form: string): string[] => {
    return routesByForm[form] || [];
  };

  // Add useEffect to log IDs when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened with:", {
        studentId,
        parentId,
        student: selectedStudent,
      });
    }
    console.log(parentId);
  }, [isOpen, studentId, parentId, selectedStudent]);

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      medicationName: "",
      form: "Viên nén",
      dosage: 0, // Changed from "" to 0
      route: "Uống",
      frequency: 1,
      totalQuantity: "",
      timeToAdminister: [""],
      startDate: "",
      endDate: "",
      note: "",
    };
    setMedications([...medications, newMedication]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  const updateMedication = (
    id: string,
    field: keyof Medication,
    value: string | number | string[]
  ) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const updateTimeSlot = (
    medicationId: string,
    index: number,
    value: string
  ) => {
    setMedications(
      medications.map((med) =>
        med.id === medicationId
          ? {
              ...med,
              timeToAdminister: med.timeToAdminister.map((time, i) =>
                i === index ? value : time
              ),
            }
          : med
      )
    );
  };

  const removeTimeSlot = (medicationId: string, index: number) => {
    setMedications(
      medications.map((med) =>
        med.id === medicationId
          ? {
              ...med,
              timeToAdminister: med.timeToAdminister.filter(
                (_, i) => i !== index
              ),
            }
          : med
      )
    );
  };

  const handleSubmit = async () => {
    // Validate medications
    const newErrors: Record<string, string> = {};
    const validMedications = medications.filter((med) => {
      let valid = true;
      if (!med.medicationName.trim()) {
        newErrors[`medicationName-${med.id}`] = "Vui lòng nhập tên thuốc";
        valid = false;
      }
      if (!med.dosage || med.dosage <= 0) {
        newErrors[`dosage-${med.id}`] = "Vui lòng nhập liều lượng lớn hơn 0";
        valid = false;
      }
      if (
        !med.totalQuantity.trim() ||
        isNaN(Number(med.totalQuantity)) ||
        Number(med.totalQuantity) < 1
      ) {
        newErrors[`totalQuantity-${med.id}`] =
          "Vui lòng nhập tổng số lượng lớn hơn 0.";
        valid = false;
      }
      if (!med.startDate) {
        newErrors[`startDate-${med.id}`] = "Vui lòng chọn ngày bắt đầu";
        valid = false;
      }
      if (!med.endDate) {
        newErrors[`endDate-${med.id}`] = "Vui lòng chọn ngày kết thúc";
        valid = false;
      }
      if (med.startDate && med.endDate && med.endDate < med.startDate) {
        newErrors[`endDate-${med.id}`] =
          "Ngày kết thúc không được nhỏ hơn ngày bắt đầu";
        valid = false;
      }
      if (!med.frequency || med.frequency < 1) {
        newErrors[`frequency-${med.id}`] = "Vui lòng nhập tần suất lớn hơn 0.";
        valid = false;
      }
      return valid;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast.error("Vui lòng kiểm tra lại thông tin đơn thuốc!");
      return;
    }

    // Map dữ liệu sang format API
    const medicalRequestItems = validMedications.map((med) => ({
      medicationName: med.medicationName,
      form: med.form,
      dosage: String(med.dosage), // Convert number to string for API
      route: med.route,
      frequency: med.frequency,
      totalQuantity: Number(med.totalQuantity),
      timeToAdminister: med.timeToAdminister.filter((t) => t),
      startDate: med.startDate,
      endDate: med.endDate,
      notes: med.note,
    }));

    const payload = {
      parentId: parentId,
      studentId: studentId,
      medicalRequestItems: medicalRequestItems,
      imageUrl: imageUrl, // Thêm imageUrl vào payload
    };

    console.log("Payload gửi API:", payload);

    try {
      await FecthCreateMedicalRequest(payload);
      showToast.success("Tạo đơn thuốc thành công!");
      onSubmit(validMedications); // Gọi lại để cập nhật UI bên ngoài nếu cần
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast.error(
          err.message || "Tạo đơn thuốc thất bại. Vui lòng thử lại."
        );
      } else {
        showToast.error("Tạo đơn thuốc thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleClose = () => {
    setMedications([
      {
        id: "1",
        medicationName: "",
        form: "Viên nén",
        dosage: 0, // Changed from "" to 0
        route: "Uống",
        frequency: 1,
        totalQuantity: "",
        timeToAdminister: [""],
        startDate: "",
        endDate: "",
        note: "",
      },
    ]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={false}
      className="max-w-6xl w-full overflow-y-auto max-h-[95vh] bg-gray-50 ring-1 ring-gray-200"
    >
      <div className="bg-white">
        {/* Header */}
        <div className="px-8 border-b-2  border-gray-100">
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              {selectedStudent && (
                <div className="space-y-1 mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tạo đơn thuốc - Học sinh: {selectedStudent.fullName} -{" "}
                    {selectedStudent.studentCode}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Lớp: {selectedStudent.studentClass.className}
                  </p>
                </div>
              )}
            </div>
            <Button
              onClick={addMedication}
              className="absolute top-[2rem] right-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Thêm thuốc
            </Button>
          </div>
        </div>
        {/* Upload ảnh đơn thuốc */}
        <div className="px-8 pt-4">
          <label className="block text-sm font-medium mb-1">
            Ảnh đơn thuốc
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                setUploading(true);
                try {
                  const res = await UploadBlogImage(e.target.files[0]);
                  setImageUrl(res.imageUrl);
                } catch {
                  showToast.error("Upload ảnh thất bại");
                } finally {
                  setUploading(false);
                }
              }
            }}
            className="block"
            disabled={uploading}
          />
          {uploading && (
            <div className="text-sm text-blue-600 mt-1">Đang tải ảnh...</div>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-2 max-h-40 rounded shadow"
            />
          )}
        </div>
        {/* Content */}
        <div className="p-2 space-y-3 max-h-[65vh] overflow-y-auto">
          {/* Không hiển thị trường nhập tên người gửi/parentId nữa */}
          {medications.map((medication, index) => (
            <div
              key={medication.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Medication Header */}
              <div className="px-8 py-5 bg-gray-50 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Thuốc {index + 1}
                    </h3>
                  </div>
                  {medications.length > 1 && (
                    <Button
                      onClick={() => removeMedication(medication.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-lg transition-colors"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Medication Content */}
              <div className="p-8 space-y-8">
                {/* Basic Information */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 border-b-2 border-gray-100 pb-3">
                    Thông tin cơ bản
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="">
                      <Label htmlFor={`medicationName-${medication.id}`}>
                        Tên thuốc <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`medicationName-${medication.id}`}
                        type="text"
                        value={medication.medicationName}
                        onChange={(e) =>
                          updateMedication(
                            medication.id,
                            "medicationName",
                            e.target.value
                          )
                        }
                        placeholder="Nhập tên thuốc"
                        className="h-11"
                      />
                      {errors[`medicationName-${medication.id}`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`medicationName-${medication.id}`]}
                        </div>
                      )}
                    </div>

                    <div className="">
                      <Label htmlFor={`form-${medication.id}`}>
                        Dạng thuốc
                      </Label>
                      <Select
                        options={medicationForms.map((form) => ({
                          value: form,
                          label: form,
                        }))}
                        placeholder="Chọn dạng thuốc"
                        onChange={(value) =>
                          updateMedication(medication.id, "form", value)
                        }
                        defaultValue={medication.form}
                      />
                    </div>
                  </div>
                </div>

                {/* Dosage Information */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 border-b-2 border-gray-100 pb-3">
                    Liều lượng và cách dùng
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor={`dosage-${medication.id}`}>
                        Liều lượng <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id={`dosage-${medication.id}`}
                          type="number"
                          value={medication.dosage}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (isNaN(val) || val < 0) {
                              updateMedication(medication.id, "dosage", 0);
                            } else {
                              updateMedication(medication.id, "dosage", val);
                            }
                          }}
                          placeholder="VD: 2"
                          className="h-11 flex-1"
                        />
                        <span className="ml-2 text-sm text-gray-600 font-medium">
                          {getUnitByRoute(medication.route)}/lần
                        </span>
                      </div>
                      {errors[`dosage-${medication.id}`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`dosage-${medication.id}`]}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`route-${medication.id}`}>
                        Cách dùng
                      </Label>
                      <Select
                        options={getRoutesByForm(medication.form).map(
                          (route) => ({
                            value: route,
                            label: route,
                          })
                        )}
                        placeholder={
                          medication.form
                            ? "Chọn cách dùng"
                            : "Vui lòng chọn dạng thuốc trước"
                        }
                        onChange={(value) =>
                          updateMedication(medication.id, "route", value)
                        }
                        defaultValue={medication.route}
                        disabled={!medication.form}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`totalQuantity-${medication.id}`}>
                        Tổng số lượng <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id={`totalQuantity-${medication.id}`}
                          type="number"
                          value={medication.totalQuantity}
                          min="1"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || Number(val) < 1) {
                              updateMedication(
                                medication.id,
                                "totalQuantity",
                                ""
                              );
                            } else {
                              updateMedication(
                                medication.id,
                                "totalQuantity",
                                val
                              );
                            }
                          }}
                          placeholder="Số lượng"
                          className="h-11 flex-1"
                        />
                        <span className="ml-2 text-sm text-gray-600 font-medium">
                          {getUnitByRoute(medication.route)}
                        </span>
                      </div>
                      {errors[`totalQuantity-${medication.id}`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`totalQuantity-${medication.id}`]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time Schedule */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 border-b-2 border-gray-100 pb-2">
                    Lịch trình cho thuốc
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`frequency-${medication.id}`}>
                        Tần suất (lần/ngày)
                      </Label>
                      <Input
                        id={`frequency-${medication.id}`}
                        type="number"
                        value={medication.frequency}
                        min="1"
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (isNaN(val) || val < 1) {
                            updateMedication(medication.id, "frequency", 1);
                          } else {
                            updateMedication(medication.id, "frequency", val);
                          }
                        }}
                        className="mt-1"
                      />
                      {errors[`frequency-${medication.id}`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`frequency-${medication.id}`]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Thời gian cho thuốc trong ngày
                    </Label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {medication.timeToAdminister.map((time, timeIndex) => (
                        <div
                          key={timeIndex}
                          className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Input
                            type="time"
                            value={time}
                            onChange={(e) =>
                              updateTimeSlot(
                                medication.id,
                                timeIndex,
                                e.target.value
                              )
                            }
                            className="w-32 border-0 bg-transparent text-gray-900 focus:ring-0 focus:outline-none text-center font-medium"
                          />
                          {medication.timeToAdminister.length > 1 && (
                            <Button
                              type="button"
                              onClick={() =>
                                removeTimeSlot(medication.id, timeIndex)
                              }
                              className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-5">
                  <h4 className="text-sm font-semibold text-gray-700 border-b-2 border-gray-100 pb-3">
                    Thời gian sử dụng
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <DatePicker
                        id={`startDate-${medication.id}`}
                        label="Ngày bắt đầu *"
                        placeholder="Chọn ngày bắt đầu"
                        minDate={DateUtils.customFormatDateOnly(new Date())}
                        maxDate={"9999-12-31"}
                        onChange={(selectedDates) => {
                          if (selectedDates.length > 0) {
                            updateMedication(
                              medication.id,
                              "startDate",
                              DateUtils.customFormatDateOnly(selectedDates[0])
                            );
                          }
                        }}
                        defaultDate={medication.startDate}
                      />
                      {errors[`startDate-${medication.id}`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`startDate-${medication.id}`]}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <DatePicker
                        id={`endDate-${medication.id}`}
                        label="Ngày kết thúc * (tự động tính)"
                        minDate={
                          medication.startDate ||
                          DateUtils.customFormatDateOnly(new Date())
                        }
                        maxDate={"9999-12-31"}
                        placeholder="Tự động tính từ ngày bắt đầu"
                        onChange={() => {
                          // Read-only, no action needed
                        }}
                        defaultDate={medication.endDate}
                      />
                      {errors[`endDate-${medication.id}`] && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors[`endDate-${medication.id}`]}
                        </div>
                      )}
                      {medication.treatmentDays &&
                        medication.treatmentDays > 0 && (
                          <div className="text-sm text-gray-600 mt-2">
                            <span className="font-semibold text-blue-600">
                              {medication.treatmentDays}
                            </span>{" "}
                            ngày điều trị
                            {medication.leftoverUnits &&
                              medication.leftoverUnits > 0 && (
                                <span className="text-xs text-yellow-700 ml-2">
                                  ⚠️ Phần dư: {medication.leftoverUnits}{" "}
                                  {getUnitByRoute(medication.route)}
                                </span>
                              )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-5">
                  <h4 className="text-sm font-semibold text-gray-700 border-b-2 border-gray-100 pb-3">
                    Ghi chú
                  </h4>
                  <div>
                    <textarea
                      id={`note-${medication.id}`}
                      value={medication.note}
                      onChange={(e) =>
                        updateMedication(medication.id, "note", e.target.value)
                      }
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm leading-relaxed"
                      placeholder="Ghi chú thêm về cách sử dụng thuốc, lưu ý đặc biệt..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-2 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">
                {medications.length}
              </span>{" "}
              loại thuốc được thêm
            </div>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="px-8 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={handleClose}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                Lưu đơn thuốc
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MultiMedicationModal;
