import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MedicationRequest {
  uid: string;
  medicationRequestId: string;
  studentId: string;
  parentId: string;
  parentName: string;
  phoneNumber: string;
  medicationName: string;
  form: string;
  dosage: string;
  route: string;
  frequency: number;
  totalQuantity: number;
  remainingQuantity: number;
  timeToAdminister: string[];
  startDate: string;
  endDate: string;
  note: string;
  status: string;
  createdBy: string;
  createdDate: string;
  studentName: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: MedicationRequest | null;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  selectedRequest,
  onConfirm,
}) => {
  if (!selectedRequest) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md w-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Xác nhận xóa</h2>
            <p className="text-sm text-gray-600">
              Hành động này không thể hoàn tác
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Bạn có chắc chắn muốn xóa đơn thuốc này?
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-600">Mã đơn:</span>{" "}
              <span className="font-medium">{selectedRequest.medicationRequestId}</span>
            </p>
            <p>
              <span className="text-gray-600">Học sinh:</span>{" "}
              <span className="font-medium">{selectedRequest.studentName}</span>
            </p>
            <p>
              <span className="text-gray-600">Thuốc:</span>{" "}
              <span className="font-medium">{selectedRequest.medicationName}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
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
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Xóa đơn thuốc
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
