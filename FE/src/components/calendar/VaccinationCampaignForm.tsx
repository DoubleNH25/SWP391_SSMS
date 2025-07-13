import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import DatePicker from "@/components/ui/form/DateField";
import { VaccinationCampaignsUpdateCreateViewModel } from "@/types/VaccinationCampaigns";
import { DateUtils } from "@/utils/DateUtils";
import ClassSelector from "./ClassSelector";

interface ClassOption {
  value: string;
  label: string;
}

interface VaccinationCampaignFormProps {
  vaccinationData: VaccinationCampaignsUpdateCreateViewModel;
  classOptions: ClassOption[];
  selectedClasses: string[];
  onInputChange: (field: keyof VaccinationCampaignsUpdateCreateViewModel, value: string | Date | string[]) => void;
  onClassChange: (classIds: string[]) => void;
  validationErrors?: Record<string, string>;
}

const VaccinationCampaignForm = ({
  vaccinationData,
  classOptions,
  selectedClasses,
  onInputChange,
  onClassChange,
  validationErrors = {}
}: VaccinationCampaignFormProps) => {
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
              Tên chiến dịch <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={vaccinationData.name || ""}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="Nhập tên chiến dịch"
              className={`w-full px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>
          <div className="w-full mt-3">
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Tên vaccine <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={vaccinationData.vaccineName || ""}
              onChange={(e) => onInputChange("vaccineName", e.target.value)}
              placeholder="Nhập tên vaccine"
              className={`w-full px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                validationErrors.vaccineName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.vaccineName && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.vaccineName}</p>
            )}
          </div>
          <div className="w-full mt-3">
            <Label className="block text-sm font-semibold text-gray-700 mb-1">
              Loại vaccine <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={vaccinationData.vaccineType || ""}
              onChange={(e) => onInputChange("vaccineType", e.target.value)}
              placeholder="Nhập loại vaccine"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                validationErrors.vaccineType ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.vaccineType && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.vaccineType}</p>
            )}
          </div>
        </div>
        <div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <DatePicker
                id="date-picker-mfg"
                label="Ngày sản xuất *"
                defaultDate={vaccinationData.mfg || new Date()}
                onChange={(date) => onInputChange("mfg", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
                minDate="1900-01-01"
                maxDate="today"
              />
              {validationErrors.mfg && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.mfg}</p>
              )}
            </div>
            <div className="w-1/2">
              <DatePicker
                id="date-picker-exp"
                label="Ngày hết hạn *"
                defaultDate={vaccinationData.exp || new Date()}
                onChange={(date) => onInputChange("exp", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
                minDate="today"
                maxDate="9000-12-31"
              />
              {validationErrors.exp && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.exp}</p>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-3">
            <div className="w-full">
              <DatePicker
                id="date-picker-start"
                label="Ngày bắt đầu *"
                defaultDate={vaccinationData.startDate || new Date()}
                onChange={(date) => onInputChange("startDate", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
                minDate="today"
                maxDate="9000-12-31"
              />
              {validationErrors.startDate && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.startDate}</p>
              )}
            </div>
            <div className="w-full mt-[2px]">
              <Label className="block text-sm font-semibold text-gray-700 mb-1">
                Thời gian <span className="text-red-500">*</span>
              </Label>
              <Input
                type="time"
                value={DateUtils.customFormatTime(vaccinationData.startDate)}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newDate = new Date(vaccinationData.startDate);
                  newDate.setHours(hours, minutes);
                  onInputChange("startDate", newDate);
                }}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-3">
            <ClassSelector
              classOptions={classOptions}
              selectedClasses={selectedClasses}
              onClassChange={handleClassChange}
              placeholder="Chọn lớp hoặc khối"
              hasError={!!validationErrors.classes}
            />
            {validationErrors.classes && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.classes}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationCampaignForm;

