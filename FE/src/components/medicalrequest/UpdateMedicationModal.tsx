import React from "react";
import { Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import DatePicker from "@/components/ui/form/DateField";
import Label from "@/components/ui/form/Label";
import { DateUtils } from "@/utils/DateUtils";
import { ListMedicalRequestViewModel } from "@/types/MedicalRequest";

interface UpdateMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateRequest: Partial<ListMedicalRequestViewModel>;
  setUpdateRequest: React.Dispatch<
    React.SetStateAction<Partial<ListMedicalRequestViewModel>>
  >;
  onConfirm: () => void;
  medicationForms: string[];
}

const UpdateMedicationModal: React.FC<UpdateMedicationModalProps> = ({
  isOpen,
  onClose,
  updateRequest,
  setUpdateRequest,
  onConfirm,
  medicationForms,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-6xl w-full overflow-y-auto"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Cập nhật đơn thuốc</h2>
        <div>
          <div className="flex justify-between items-start gap-6">
            <div className="space-y-4 w-[45%]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="updateParentName">Tên phụ huynh</Label>
                  <Input
                    id="updateParentName"
                    type="text"
                    value={updateRequest.parentName || ""}
                    onChange={(e) =>
                      setUpdateRequest({
                        ...updateRequest,
                        parentName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="updateStudentName">Tên học sinh</Label>
                <Input
                  id="updateStudentName"
                  type="text"
                  value={updateRequest.studentName || ""}
                  onChange={(e) =>
                    setUpdateRequest({
                      ...updateRequest,
                      studentName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="updateMedicationName">Tên thuốc</Label>
                  <Input
                    id="updateMedicationName"
                    type="text"
                    value={updateRequest.medicationName || ""}
                    onChange={(e) =>
                      setUpdateRequest({
                        ...updateRequest,
                        medicationName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="updateForm">Dạng thuốc</Label>
                  <Select
                    options={medicationForms.map((form) => ({
                      value: form,
                      label: form,
                    }))}
                    placeholder="Chọn dạng thuốc"
                    onChange={(value) =>
                      setUpdateRequest({ ...updateRequest, form: value })
                    }
                    defaultValue={updateRequest.form || ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="updateDosage">Liều lượng</Label>
                  <Input
                    id="updateDosage"
                    type="text"
                    value={updateRequest.dosage || ""}
                    onChange={(e) =>
                      setUpdateRequest({
                        ...updateRequest,
                        dosage: e.target.value,
                      })
                    }
                    placeholder="2 viên/lần, 5ml/lần..."
                  />
                </div>
              </div>
            </div>
            <div className="w-[1px] bg-gray-300 self-stretch" />
            <div className="w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="updateFrequency">Tần suất (lần/ngày)</Label>
                  <Input
                    id="updateFrequency"
                    type="number"
                    value={updateRequest.frequency || ""}
                    onChange={(e) =>
                      setUpdateRequest({
                        ...updateRequest,
                        frequency: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max="6"
                  />
                </div>
                <div>
                  <Label htmlFor="updateTotalQuantity">Tổng số lượng</Label>
                  <Input
                    id="updateTotalQuantity"
                    type="number"
                    value={updateRequest.totalQuantity || ""}
                    onChange={(e) =>
                      setUpdateRequest({
                        ...updateRequest,
                        totalQuantity: Number(e.target.value),
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
                    {updateRequest.timeToAdminister?.map(
                      (time: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center bg-white border border-gray-300 rounded-lg p-2 hover:border-gray-400 transition-colors"
                        >
                          <Input
                            type="time"
                            value={time}
                            onChange={(e) => {
                              const newTimes = [
                                ...(updateRequest.timeToAdminister || []),
                              ];
                              newTimes[index] = e.target.value;
                              setUpdateRequest({
                                ...updateRequest,
                                timeToAdminister: newTimes,
                              });
                            }}
                            className="w-28 border-0 bg-transparent text-gray-900 focus:ring-0 focus:outline-none"
                          />
                          {(updateRequest.timeToAdminister?.length || 0) >
                            1 && (
                            <Button
                              type="button"
                              onClick={() => {
                                const newTimes =
                                  updateRequest.timeToAdminister?.filter(
                                    (_: string, i: number) => i !== index
                                  ) || [];
                                setUpdateRequest({
                                  ...updateRequest,
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
                      )
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      const newTimes = [
                        ...(updateRequest.timeToAdminister || []),
                        "",
                      ];
                      setUpdateRequest({
                        ...updateRequest,
                        timeToAdminister: newTimes,
                      });
                    }}
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
                    id="updateStartDate"
                    label="Ngày bắt đầu"
                    placeholder="Chọn ngày bắt đầu"
                    minDate={DateUtils.customFormatDateOnly(new Date())}
                    maxDate={"9999-12-31"}
                    onChange={(selectedDates) => {
                      if (selectedDates.length > 0) {
                        setUpdateRequest({
                          ...updateRequest,
                          startDate: DateUtils.customFormatDateOnly(
                            selectedDates[0]
                          ),
                        });
                      }
                    }}
                    defaultDate={updateRequest.startDate}
                  />
                </div>
                <div>
                  <DatePicker
                    id="updateEndDate"
                    label="Ngày kết thúc"
                    minDate={DateUtils.customFormatDateOnly(new Date())}
                    maxDate={"9999-12-31"}
                    placeholder="Chọn ngày kết thúc"
                    onChange={(selectedDates) => {
                      if (selectedDates.length > 0) {
                        setUpdateRequest({
                          ...updateRequest,
                          endDate: DateUtils.customFormatDateOnly(
                            selectedDates[0]
                          ),
                        });
                      }
                    }}
                    defaultDate={updateRequest.endDate}
                  />
                </div>
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
              onClick={onConfirm}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Cập nhật đơn thuốc
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateMedicationModal;
