import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";
import { Student } from "@/types/Student";
import { MedicalRequestItems } from "@/types/MedicalRequest";

interface StudentOption {
  value: string;
  label: string;
}
interface MedicineOption {
  value: string;
  label: string;
}
interface FormOption {
  value: string;
  label: string;
}

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  students: StudentOption[];
  medicines: MedicineOption[];
  forms: FormOption[];
  selectedStudent?: Student | null;
  parentId: string; // Thêm prop parentId
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  medicines,
  forms,
  selectedStudent,
  parentId,
}) => {
  // State chung
  const [studentId, setStudentId] = useState("");
  const [localParentId, setLocalParentId] = useState(parentId || "");
  // State lưu nhiều thuốc
  const [medications, setMedications] = useState<MedicalRequestItems[]>([
    {
      medicationName: "",
      form: "",
      dosage: "",
      route: "",
      frequency: 1,
      totalQuantity: 1,
      timeToAdminister: [""],
      startDate: "",
      endDate: "",
      notes: "",
    },
  ]);
  // State cho ảnh đơn thuốc (cả đơn)
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Khi chọn học sinh, gọi API lấy parentId
  useEffect(() => {
    if (studentId) {
      fetch(`/api/medical-request/parent-id/${studentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setLocalParentId(data.parentId || ""))
        .catch(() => setLocalParentId(""));
    }
  }, [studentId]);

  // Khi mở modal, nếu đã có selectedStudent thì gọi API lấy parentId
  useEffect(() => {
    if (isOpen && selectedStudent && selectedStudent.id) {
      setStudentId(selectedStudent.id); // set luôn studentId
      fetch(`/api/medical-request/parent-id/${selectedStudent.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setLocalParentId(data.parentId || ""))
        .catch(() => setLocalParentId(""));
    }
  }, [isOpen, selectedStudent]);

  // Thêm thuốc mới
  const handleAddMedication = () => {
    setMedications((prev) => [
      ...prev,
      {
        medicationName: "",
        form: "",
        dosage: "",
        route: "",
        frequency: 1,
        totalQuantity: 1,
        timeToAdminister: [""],
        startDate: "",
        endDate: "",
        notes: "",
      },
    ]);
  };

  // Xóa thuốc
  const handleRemoveMedication = (idx: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== idx));
  };

  // Cập nhật trường cho từng thuốc
  const handleMedicationChange = (
    idx: number,
    name: string,
    value: string | number
  ) => {
    setMedications((prev) =>
      prev.map((med, i) => (i === idx ? { ...med, [name]: value } : med))
    );
  };

  // Cập nhật timeToAdminister cho từng thuốc
  const handleTimeChange = (medIdx: number, timeIdx: number, value: string) => {
    setMedications((prev) =>
      prev.map((med, i) =>
        i === medIdx
          ? {
              ...med,
              timeToAdminister: med.timeToAdminister.map((t, j) =>
                j === timeIdx ? value : t
              ),
            }
          : med
      )
    );
  };

  // Thêm mốc giờ cho từng thuốc
  const handleAddTime = (medIdx: number) => {
    setMedications((prev) =>
      prev.map((med, i) =>
        i === medIdx
          ? { ...med, timeToAdminister: [...med.timeToAdminister, ""] }
          : med
      )
    );
  };

  // Xóa mốc giờ cho từng thuốc
  const handleRemoveTime = (medIdx: number, timeIdx: number) => {
    setMedications((prev) =>
      prev.map((med, i) =>
        i === medIdx
          ? {
              ...med,
              timeToAdminister: med.timeToAdminister.filter(
                (_, j) => j !== timeIdx
              ),
            }
          : med
      )
    );
  };

  // Upload ảnh cho cả đơn thuốc
  const handleImageChange = async (file: File | null) => {
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("Image", file);
    try {
      const res = await fetch("/api/medical-request/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const url = data.url || data.imageUrl || data.image || "";
      setImageUrl(url);
    } catch {
      // lỗi upload
    }
    setUploadingImage(false);
  };

  // Khi chọn học sinh, reset thuốc và ảnh
  React.useEffect(() => {
    if (selectedStudent && isOpen) {
      setStudentId(selectedStudent.id);
      setMedications([
        {
          medicationName: "",
          form: "",
          dosage: "",
          route: "",
          frequency: 1,
          totalQuantity: 1,
          timeToAdminister: [""],
          startDate: "",
          endDate: "",
          notes: "",
        },
      ]);
      setImageUrl("");
    }
  }, [selectedStudent, isOpen]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!studentId) newErrors.studentId = "Vui lòng chọn học sinh";
    if (!medications.length)
      newErrors.medications = "Vui lòng thêm ít nhất một thuốc";
    for (let i = 0; i < medications.length; i++) {
      const med = medications[i];
      if (!med.medicationName) newErrors[`medicationName-${i}`] = "Chọn thuốc";
      if (!med.form) newErrors[`form-${i}`] = "Chọn dạng thuốc";
      if (!med.dosage) newErrors[`dosage-${i}`] = "Nhập liều lượng";
      if (!med.frequency || med.frequency < 1)
        newErrors[`frequency-${i}`] = "Tần suất phải >= 1";
      if (!med.totalQuantity || med.totalQuantity < 1)
        newErrors[`totalQuantity-${i}`] = "Tổng số lượng phải >= 1";
      if (!med.startDate) newErrors[`startDate-${i}`] = "Chọn ngày bắt đầu";
      if (!med.endDate) newErrors[`endDate-${i}`] = "Chọn ngày kết thúc";
      // Validate ngày kết thúc >= ngày bắt đầu
      if (med.startDate && med.endDate && med.endDate < med.startDate) {
        newErrors[`endDate-${i}`] =
          "Ngày kết thúc không được nhỏ hơn ngày bắt đầu";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Đóng gói đúng cấu trúc API
    const payload = {
      studentId,
      parentId: localParentId,
      imageUrl,
      medicalRequestItems: medications,
    };
    console.log(payload);
    onSubmit(payload);
    onClose();
    setMedications([
      {
        medicationName: "",
        form: "",
        dosage: "",
        route: "",
        frequency: 1,
        totalQuantity: 1,
        timeToAdminister: [""],
        startDate: "",
        endDate: "",
        notes: "",
      },
    ]);
    setStudentId("");
    setImageUrl("");
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Thêm đơn thuốc mới</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Học sinh</Label>
            <Select
              options={students}
              placeholder="Chọn học sinh"
              onChange={(v) => setStudentId(v)}
              defaultValue={studentId}
            />
            {errors.studentId && (
              <div className="text-red-500 text-xs">{errors.studentId}</div>
            )}
          </div>
        </div>
        {/* Upload ảnh cho cả đơn thuốc */}
        <div className="mt-2">
          <Label>Ảnh đơn thuốc</Label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0] || null;
              await handleImageChange(file);
            }}
            disabled={uploadingImage}
          />
          {uploadingImage && (
            <div className="text-blue-500 text-xs">Đang tải ảnh...</div>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Ảnh đơn thuốc"
              className="mt-2 max-h-24 rounded"
            />
          )}
        </div>
        <div className="space-y-8">
          {medications.map((med, idx) => (
            <div key={idx} className="border rounded-lg p-4 mb-2 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-blue-700">
                  Thuốc {idx + 1}
                </span>
                {medications.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleRemoveMedication(idx)}
                  >
                    Xóa
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Tên thuốc</Label>
                  <Select
                    options={medicines}
                    placeholder="Chọn thuốc"
                    onChange={(v) =>
                      handleMedicationChange(idx, "medicationName", v)
                    }
                    defaultValue={med.medicationName}
                  />
                  {errors[`medicationName-${idx}`] && (
                    <div className="text-red-500 text-xs">
                      {errors[`medicationName-${idx}`]}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Dạng thuốc</Label>
                  <Select
                    options={forms}
                    placeholder="Chọn dạng thuốc"
                    onChange={(v) => handleMedicationChange(idx, "form", v)}
                    defaultValue={med.form}
                  />
                  {errors[`form-${idx}`] && (
                    <div className="text-red-500 text-xs">
                      {errors[`form-${idx}`]}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Liều lượng</Label>
                  <Input
                    name="dosage"
                    value={med.dosage}
                    onChange={(e) =>
                      handleMedicationChange(idx, "dosage", e.target.value)
                    }
                  />
                  {errors[`dosage-${idx}`] && (
                    <div className="text-red-500 text-xs">
                      {errors[`dosage-${idx}`]}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Cách dùng</Label>
                  <Input
                    name="route"
                    value={med.route}
                    onChange={(e) =>
                      handleMedicationChange(idx, "route", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Tần suất (lần/ngày)</Label>
                  <Input
                    name="frequency"
                    type="number"
                    min={"1"}
                    value={String(med.frequency)}
                    onChange={(e) =>
                      handleMedicationChange(
                        idx,
                        "frequency",
                        Number(e.target.value)
                      )
                    }
                  />
                  {errors[`frequency-${idx}`] && (
                    <div className="text-red-500 text-xs">
                      {errors[`frequency-${idx}`]}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Tổng số lượng</Label>
                  <Input
                    name="totalQuantity"
                    type="number"
                    min={"1"}
                    value={String(med.totalQuantity)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      handleMedicationChange(
                        idx,
                        "totalQuantity",
                        val < 1 ? "" : val
                      );
                    }}
                  />
                  {errors[`totalQuantity-${idx}`] && (
                    <div className="text-red-500 text-xs">
                      {errors[`totalQuantity-${idx}`]}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <Label>Thời gian cho thuốc</Label>
                <div className="space-y-2">
                  {med.timeToAdminister.map((time, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) =>
                          handleTimeChange(idx, tIdx, e.target.value)
                        }
                      />
                      {med.timeToAdminister.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleRemoveTime(idx, tIdx)}
                          variant="outline"
                          className="px-2 py-1"
                        >
                          X
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => handleAddTime(idx)}
                    variant="outline"
                    className="px-2 py-1 mt-1"
                  >
                    + Thêm mốc giờ
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Ngày bắt đầu</Label>
                  <Input
                    name="startDate"
                    type="date"
                    value={med.startDate}
                    onChange={(e) =>
                      handleMedicationChange(idx, "startDate", e.target.value)
                    }
                  />
                  {errors[`startDate-${idx}`] && (
                    <div className="text-red-500 text-xs">
                      {errors[`startDate-${idx}`]}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Ngày kết thúc</Label>
                  <Input
                    name="endDate"
                    type="date"
                    value={med.endDate}
                    onChange={(e) =>
                      handleMedicationChange(idx, "endDate", e.target.value)
                    }
                    min={med.startDate || undefined}
                  />
                  {errors[`endDate-${idx}`] && (
                    <div className="text-red-500 text-xs">
                      {errors[`endDate-${idx}`]}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <Label>Ghi chú</Label>
                <textarea
                  name="notes"
                  value={med.notes}
                  onChange={(e) =>
                    handleMedicationChange(idx, "notes", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          onClick={handleAddMedication}
          variant="outline"
          className="w-full mt-2"
        >
          + Thêm thuốc
        </Button>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" className="bg-blue-600 text-white">
            Lưu đơn thuốc
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMedicationModal;
