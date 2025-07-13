import { CalendarEvent, eventCategories } from "@/types/CalendarEvent";
import { DateUtils } from "@/utils/DateUtils";
import { MedicalEventUpdateCreateViewModel } from "@/types/MedicalEvent";
import { VaccinationCampaignsUpdateCreateViewModel } from "@/types/VaccinationCampaigns";
import { showToast } from "../ui/Toast";

interface ViewEventsModalProps {
  viewEventsDate: string | null;
  events: CalendarEvent[];
  loading: boolean;
  onEventClick: (event: CalendarEvent) => void;
  onClose: () => void;
  onAddNewEvent: () => void;
  onSetFormData: (formData : FormDataType | ((prev: FormDataType) => FormDataType)) => void;
  classOptions: { value: string; label: string }[];
  isAdmin?: boolean;
}

type FormDataType =
  | { type: "medical"; data: MedicalEventUpdateCreateViewModel }
  | { type: "vaccination"; data: VaccinationCampaignsUpdateCreateViewModel };

const ViewEventsModal = ({ 
  viewEventsDate, 
  events, 
  loading, 
  onEventClick, 
  onClose, 
  onAddNewEvent,
  onSetFormData,
  classOptions,
  isAdmin = false
}: ViewEventsModalProps) => {
  if (!viewEventsDate) return null;

  const eventsForDate = events
    .filter(event => {
      const eventDate = new Date(event.start).toDateString();
      const targetDate = new Date(viewEventsDate).toDateString();
      return eventDate === targetDate;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const handleAddNewEvent = () => {
    const viewDate = new Date(viewEventsDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    if (viewDate < currentDate) {
      showToast.error("Cannot create events in the past!");
      return;
    }
    
    onSetFormData((prev) => {
      const newDate = new Date(viewEventsDate);
      newDate.setHours(9, 0);
      
      if (prev.type === "medical") {
        return {
          ...prev,
          data: {
            ...prev.data,
            scheduledDate: DateUtils.customFormatDateForBackend(newDate),
          } as MedicalEventUpdateCreateViewModel,
        };
      } else {
        return {
          ...prev,
          data: {
            ...prev.data,
            startDate: DateUtils.customFormatDateForBackend(newDate),
          } as VaccinationCampaignsUpdateCreateViewModel,
        };
      }
    });
    
    onAddNewEvent();
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Lịch cho {new Date(viewEventsDate).toLocaleDateString()}
      </h3>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {eventsForDate.length > 0 ? (
          eventsForDate.map((event) => {
            const category = eventCategories[event.extendedProps.calendar] || eventCategories.Pending;
            return (
              <div
                key={event.id}
                className={`p-3 rounded-md cursor-pointer hover:opacity-80 ${category.lightColor} ${category.textColor} border-l-4 border-${category.color.split("-")[1]}-500`}
                onClick={() => onEventClick(event)}
              >
                <div className="flex justify-between">
                  <div className="font-medium text-base">{event.title}</div>
                  <div>
                    <span className="text-sm">Loại: {event.extendedProps.eventType === "medical" ? "Kiểm tra sức khỏe" : "Chiến dịch tiêm chủng"}</span>
                  </div>
                </div>
                
                <div className="text-sm ml-2">
                  {event.extendedProps.eventType === "medical"
                    ? event.extendedProps.description || "Không có mô tả"
                    : `Vaccine: ${event.extendedProps.vaccineName || "Không có tên vaccine"}`}
                </div>
                
                {event.extendedProps.eventType === "vaccination" && (
                  <div className="text-sm mt-1 ml-2">
                    <div className="mt-1">Loại vaccine: {event.extendedProps.vaccineType}</div>
                    <div className="mt-1">Ngày sản xuất: {new Date(event.extendedProps.mfg!).toLocaleDateString()}</div>
                    <div className="mt-1">Ngày hết hạn: {new Date(event.extendedProps.exp!).toLocaleDateString()}</div>
                  </div>
                )}
                
                <div className="text-sm mt-1 ml-2">
                  <span>Thời gian:</span> {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-sm mt-1 ml-2">
                  <span>Lớp: </span>
                  {(() => {
                    const validClassIds = event.extendedProps.classIds?.filter(id => id && id.trim() !== "") || [];
                    return validClassIds.length > 0 ? (
                      validClassIds.map((classId, index) => {
                        const classOption = classOptions.find(option => option.value === classId);
                        const className = classOption ? classOption.label : `Class ${classId}`;
                        return (
                          <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-2">
                            {className}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-gray-500">
                        Không có lớp nào
                      </span>
                    );
                  })()}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 text-sm">Không có sự kiện nào cho ngày này.</div>
        )}
      </div>
      
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          {!isAdmin && (
            <button
              onClick={handleAddNewEvent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              disabled={loading}
            >
              Thêm sự kiện
            </button>
          )}
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Đóng
          </button>
        </div>
    </div>
  );
};

export default ViewEventsModal;
