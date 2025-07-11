import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";

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
  onSubmit: (data: any) => void;
  students: StudentOption[];
  medicines: MedicineOption[];
  forms: FormOption[];
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  medicines,
  forms,
}) => {
  const [formData, setFormData] = useState({
    studentId: "",
    parentName: "",
    phoneNumber: "",
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
  });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!formData.studentId) newErrors.studentId = "Chọn học sinh";
    if (!formData.medicationName) newErrors.medicationName = "Chọn thuốc";
    if (!formData.form) newErrors.form = "Chọn dạng thuốc";
    if (!formData.dosage) newErrors.dosage = "Nhập liều lượng";
    if (!formData.frequency || formData.frequency < 1)
      newErrors.frequency = "Tần suất phải >= 1";
    if (!formData.totalQuantity || formData.totalQuantity < 1)
      newErrors.totalQuantity = "Tổng số lượng phải >= 1";
    if (!formData.startDate) newErrors.startDate = "Chọn ngày bắt đầu";
    if (!formData.endDate) newErrors.endDate = "Chọn ngày kết thúc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSelect = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (idx: number, value: string) => {
    const newTimes = [...formData.timeToAdminister];
    newTimes[idx] = value;
    setFormData((prev) => ({ ...prev, timeToAdminister: newTimes }));
  };

  const handleAddTime = () => {
    setFormData((prev) => ({
      ...prev,
      timeToAdminister: [...prev.timeToAdminister, ""],
    }));
  };

  const handleRemoveTime = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      timeToAdminister: prev.timeToAdminister.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
    setFormData({
      studentId: "",
      parentName: "",
      phoneNumber: "",
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
    });
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl w-full">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Thêm đơn thuốc mới</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Học sinh</Label>
            <Select
              options={students}
              placeholder="Chọn học sinh"
              onChange={(v) => handleSelect("studentId", v)}
              defaultValue={formData.studentId}
            />
            {errors.studentId && (
              <div className="text-red-500 text-xs">{errors.studentId}</div>
            )}
          </div>
          <div>
            <Label>Phụ huynh</Label>
            <Input
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Số điện thoại</Label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Tên thuốc</Label>
            <Select
              options={medicines}
              placeholder="Chọn thuốc"
              onChange={(v) => handleSelect("medicationName", v)}
              defaultValue={formData.medicationName}
            />
            {errors.medicationName && (
              <div className="text-red-500 text-xs">
                {errors.medicationName}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Dạng thuốc</Label>
            <Select
              options={forms}
              placeholder="Chọn dạng thuốc"
              onChange={(v) => handleSelect("form", v)}
              defaultValue={formData.form}
            />
            {errors.form && (
              <div className="text-red-500 text-xs">{errors.form}</div>
            )}
          </div>
          <div>
            <Label>Liều lượng</Label>
            <Input
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
            />
            {errors.dosage && (
              <div className="text-red-500 text-xs">{errors.dosage}</div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Cách dùng</Label>
            <Input
              name="route"
              value={formData.route}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Tần suất (lần/ngày)</Label>
            <Input
              name="frequency"
              type="number"
              min={1}
              value={formData.frequency}
              onChange={handleChange}
            />
            {errors.frequency && (
              <div className="text-red-500 text-xs">{errors.frequency}</div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tổng số lượng</Label>
            <Input
              name="totalQuantity"
              type="number"
              min={1}
              value={formData.totalQuantity}
              onChange={handleChange}
            />
            {errors.totalQuantity && (
              <div className="text-red-500 text-xs">{errors.totalQuantity}</div>
            )}
          </div>
          <div>
            <Label>Thời gian cho thuốc</Label>
            <div className="space-y-2">
              {formData.timeToAdminister.map((time, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(idx, e.target.value)}
                  />
                  {formData.timeToAdminister.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveTime(idx)}
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
                onClick={handleAddTime}
                variant="outline"
                className="px-2 py-1 mt-1"
              >
                + Thêm mốc giờ
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Ngày bắt đầu</Label>
            <Input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && (
              <div className="text-red-500 text-xs">{errors.startDate}</div>
            )}
          </div>
          <div>
            <Label>Ngày kết thúc</Label>
            <Input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && (
              <div className="text-red-500 text-xs">{errors.endDate}</div>
            )}
          </div>
        </div>
        <div>
          <Label>Ghi chú</Label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" className="bg-blue-600 text-white">
            Thêm đơn thuốc
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMedicationModal;
