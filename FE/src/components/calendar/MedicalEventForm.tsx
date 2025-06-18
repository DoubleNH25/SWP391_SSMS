import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import DatePicker from "@/components/ui/form/DateField";
import { MedicalEventUpdateCreateViewModel } from "@/types/MedicalEvent";
import { DateUtils } from "@/utils/DateUtils";
import ClassSelector from "./ClassSelector";

interface ClassOption {
  value: string;
  label: string;
}

interface MedicalEventFormProps {
  medicalData: MedicalEventUpdateCreateViewModel;
  classOptions: ClassOption[];
  selectedClasses: string[];
  onInputChange: (field: keyof MedicalEventUpdateCreateViewModel, value: string | Date | string[]) => void;
  onClassChange: (classIds: string[]) => void;
  validationErrors?: Record<string, string>;
}

const MedicalEventForm = ({
  medicalData,
  classOptions,
  selectedClasses,
  onInputChange,
  onClassChange,
  validationErrors = {}
}: MedicalEventFormProps) => {
  const handleClassChange = (classIds: string[]) => {
    onClassChange(classIds);
    onInputChange("classIds", classIds.length > 0 ? classIds as [string] : [""] as [string]);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-10 w-full mt-5">
        <div className="w-1/2">
          <div className="w-full mt-[2px]">
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Tên sự kiện <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={medicalData.name || ""}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="Nhập tên sự kiện"
              className={`w-full px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <ClassSelector
            classOptions={classOptions}
            selectedClasses={selectedClasses}
            onClassChange={handleClassChange}
            placeholder="Chọn lớp hoặc khối"
          />
          {validationErrors.classes && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.classes}</p>
          )}
        </div>
      </div>

      <div className="w-full mt-3">
        <Label className="block text-sm font-semibold text-gray-700 mb-1">
          Mô tả <span className="text-red-500">*</span>
        </Label>
        <textarea
          value={medicalData.description || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onInputChange("description", e.target.value)}
          placeholder="Nhập mô tả"
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${validationErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {validationErrors.description && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
        )}
      </div>

      <div className="flex justify-between">
        <div>
          <DatePicker
            id="date-picker-medical"
            label="Ngày dự kiến *"
            defaultDate={medicalData.scheduledDate || new Date()}
            onChange={(date) => onInputChange("scheduledDate", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
            minDate="today"
            maxDate="9000-12-31"
          />
          {validationErrors.scheduledDate && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.scheduledDate}</p>
          )}
        </div>
        <div>
          <Label className="block text-sm font-semibold text-gray-700 mb-1">
            Thời gian <span className="text-red-500">*</span>
          </Label>
          <Input
            type="time"
            value={DateUtils.customFormatTime(medicalData.scheduledDate)}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':').map(Number);
              const newDate = new Date(medicalData.scheduledDate);
              newDate.setHours(hours, minutes);
              onInputChange("scheduledDate", newDate);
            }}
            className="w-full mt-[2px] px-3 py-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalEventForm;

