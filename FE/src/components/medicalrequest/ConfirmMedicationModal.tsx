import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Label from "@/components/ui/form/Label";
import { ListMedicalRequestViewModel } from "@/types/MedicalRequest";

interface ConfirmMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: ListMedicalRequestViewModel | null;
  confirmNote: string;
  setConfirmNote: (note: string) => void;
  onConfirm: () => void;
}

const ConfirmMedicationModal: React.FC<ConfirmMedicationModalProps> = ({
  isOpen,
  onClose,
  selectedRequest,
  confirmNote,
  setConfirmNote,
  onConfirm,
}) => {
  if (!selectedRequest) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md w-full">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Xác nhận cho thuốc</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Thông tin thuốc:</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Học sinh:</span>{" "}
                <span className="font-medium">
                  {selectedRequest.studentName}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Thuốc:</span>{" "}
                <span className="font-medium">
                  {selectedRequest.medicationName}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Liều lượng:</span>{" "}
                <span className="font-medium">{selectedRequest.dosage}</span>
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmNote">Ghi chú (tùy chọn)</Label>
            <textarea
              id="confirmNote"
              value={confirmNote}
              onChange={(e) => setConfirmNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập ghi chú về việc cho thuốc..."
            />
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
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Xác nhận đã cho thuốc
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmMedicationModal;
