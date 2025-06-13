import React from "react";
import { Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import DatePicker from "@/components/ui/form/DateField";
import Label from "@/components/ui/form/Label";

interface NewRequest {
  parentName: string;
  phoneNumber: string;
  studentName: string;
  medicationName: string;
  form: string;
  dosage: string;
  route: string;
  frequency: number;
  totalQuantity: string;
  timeToAdminister: string[];
  startDate: string;
  endDate: string;
  note: string;
}

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  newRequest: NewRequest;
  setNewRequest: (request: NewRequest) => void;
  onSubmit: () => void;
  onAddTimeSlot: () => void;
  onTimeChange: (index: number, value: string) => void;
  medicationForms: string[];
  routes: string[];
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  newRequest,
  setNewRequest,
  onSubmit,
  onAddTimeSlot,
  onTimeChange,
  medicationForms,
  routes,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-6xl w-full overflow-y-auto"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Thêm đơn thuốc mới</h2>
        <div>
          <div className="flex justify-between items-start gap-6">
            <div className="space-y-4 w-[45%]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName">Tên phụ huynh</Label>
                  <Input
                    id="parentName"
                    type="text"
                    value={newRequest.parentName}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        parentName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={newRequest.phoneNumber}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="studentName">Tên học sinh</Label>
                <Input
                  id="studentName"
                  type="text"
                  value={newRequest.studentName}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      studentName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medicationName">Tên thuốc</Label>
                  <Input
                    id="medicationName"
                    type="text"
                    value={newRequest.medicationName}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        medicationName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="form">Dạng thuốc</Label>
                  <Select
                    options={medicationForms.map((form) => ({
                      value: form,
                      label: form,
                    }))}
                    placeholder="Chọn dạng thuốc"
                    onChange={(value) =>
                      setNewRequest({ ...newRequest, form: value })
                    }
                    defaultValue={newRequest.form}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dosage">Liều lượng</Label>
                  <Input
                    id="dosage"
                    type="text"
                    value={newRequest.dosage}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, dosage: e.target.value })
                    }
                    placeholder="2 viên/lần, 5ml/lần..."
                  />
                </div>
                <div>
                  <Label htmlFor="route">Cách dùng</Label>
                  <Select
                    options={routes.map((route) => ({
                      value: route,
                      label: route,
                    }))}
                    placeholder="Chọn cách dùng"
                    onChange={(value) =>
                      setNewRequest({ ...newRequest, route: value })
                    }
                    defaultValue={newRequest.route}
                  />
                </div>
              </div>
            </div>
            <div className="w-[1px] bg-gray-300 self-stretch" />
            <div className="w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency">Tần suất (lần/ngày)</Label>
                  <Input
                    id="frequency"
                    type="number"
                    value={newRequest.frequency}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        frequency: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max="6"
                  />
                </div>
                <div>
                  <Label htmlFor="totalQuantity">Tổng số lượng</Label>
                  <Input
                    id="totalQuantity"
                    type="number"
                    value={newRequest.totalQuantity}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        totalQuantity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="my-4">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Thời gian cho thuốc
                </Label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {newRequest.timeToAdminister.map((time, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white border border-gray-300 rounded-lg p-2 hover:border-gray-400 transition-colors"
                      >
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) =>
                            onTimeChange(index, e.target.value)
                          }
                          className="w-28 border-0 bg-transparent text-gray-900 focus:ring-0 focus:outline-none"
                        />
                        {newRequest.timeToAdminister.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => {
                              const newTimes =
                                newRequest.timeToAdminister.filter(
                                  (_, i) => i !== index
                                );
                              setNewRequest({
                                ...newRequest,
                                timeToAdminister: newTimes,
                              });
                            }}
                            className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                            title="Xóa thời gian này"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={onAddTimeSlot}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm thời gian
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <DatePicker
                    id="startDate"
                    label="Ngày bắt đầu"
                    placeholder="Chọn ngày bắt đầu"
                    minDate={new Date().toISOString().split("T")[0]}
                    maxDate={"9999-12-31"}
                    onChange={(selectedDates) => {
                      if (selectedDates.length > 0) {
                        setNewRequest({
                          ...newRequest,
                          startDate: selectedDates[0]
                            .toISOString()
                            .split("T")[0],
                        });
                      }
                    }}
                    defaultDate={newRequest.startDate}
                  />
                </div>
                <div>
                  <DatePicker
                    id="endDate"
                    label="Ngày kết thúc"
                    minDate={new Date().toISOString().split("T")[0]}
                    maxDate={"9999-12-31"}
                    placeholder="Chọn ngày kết thúc"
                    onChange={(selectedDates) => {
                      if (selectedDates.length > 0) {
                        setNewRequest({
                          ...newRequest,
                          endDate: selectedDates[0]
                            .toISOString()
                            .split("T")[0],
                        });
                      }
                    }}
                    defaultDate={newRequest.endDate}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="note">Ghi chú</Label>
                <textarea
                  id="note"
                  value={newRequest.note}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, note: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ghi chú thêm về cách sử dụng thuốc..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="px-6 hover:bg-gray-200"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Lưu đơn thuốc
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddMedicationModal;
